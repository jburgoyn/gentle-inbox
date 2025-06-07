import {onRequest} from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import * as admin from "firebase-admin";
import OpenAI from 'openai';

admin.initializeApp();

import { firestore } from 'firebase-admin';
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

import axios from 'axios';
import cors from "cors";
const corsHandler = cors({ origin: true });

type PostmarkInboundWebhook = {
  From: string;
  MessageStream: string;
  FromName: string;
  FromFull: {
    Email: string;
    Name: string;
    MailboxHash: string;
  };
  To: string;
  ToFull: Array<{
    Email: string;
    Name: string;
    MailboxHash: string;
  }>;
  Cc: string;
  CcFull: Array<{
    Email: string;
    Name: string;
    MailboxHash: string;
  }>;
  Bcc: string;
  BccFull: Array<{
    Email: string;
    Name: string;
    MailboxHash: string;
  }>;
  OriginalRecipient: string;
  ReplyTo: string;
  Subject: string;
  MessageID: string;
  Date: string;
  MailboxHash: string;
  TextBody: string;
  HtmlBody: string;
  StrippedTextReply: string;
  Tag: string;
  Headers: Array<{
    Name: string;
    Value: string;
  }>;
  Attachments: Array<{
    Name: string;
    Content: string;
    ContentType: string;
    ContentLength: number;
    ContentID: string;
  }>;
};

const db = firestore();
export const handleInboundEmail = onRequest(async (request, response) => {
    try {
        logger.info("Received data in handleInboundEmail", {
          body: request.body,
        });

      // Parse the data from inboundEmailWebhook
      const { business, body: emailData } = request.body as { business: any, body: PostmarkInboundWebhook };
      
      if (!business || !emailData) {
        logger.error("Missing business or email data");
        response.status(400).send("Invalid request data");
        return;
      }
      // Get the email content
      const emailContent = emailData.TextBody || emailData.HtmlBody || "";
      
      // Transform the email using OpenAI
      let transformedText = "";
      let wasTransformed = false;
      const startTime = Date.now();
      
      try {
        const completion = await openai.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content: `You are a professional communication specialist who helps transform harsh customer feedback into constructive, actionable insights while preserving all important information. Your goal is to protect business owners' emotional wellbeing while ensuring they receive valuable feedback they can act upon.
      
      CRITICAL: You are ONLY rewriting the customer's original feedback message. You are NOT writing a response TO the feedback. You are NOT drafting what the business should say back. You are ONLY transforming the customer's words into a gentler version.
      
      CORE PRINCIPLES:
      1. PRESERVE ALL FACTUAL CONTENT - Never remove actual issues, problems, or legitimate concerns
      2. REMOVE PERSONAL ATTACKS - Eliminate insults, profanity, and character assassination
      3. SOFTEN TONE - Transform aggressive language into professional, constructive communication
      4. MAINTAIN URGENCY - If something is truly urgent or important, keep that sense of priority
      5. ADD CONSTRUCTIVE FRAMING - Where possible, frame issues as opportunities for improvement
      
      TRANSFORMATION GUIDELINES:
      - Replace insults with neutral descriptive language
      - Convert aggressive demands into polite requests
      - Transform absolute statements ("worst ever") into specific concerns
      - Remove profanity and replace with professional language
      - Keep all specific details about what went wrong
      - Maintain any positive aspects mentioned
      - Preserve the customer's desired outcome or resolution
      - Use empathetic but professional tone
      - MAINTAIN THE CUSTOMER'S PERSPECTIVE - Write as if the customer is still speaking
      
      TONE TARGETS:
      - Professional but understanding
      - Firm but respectful
      - Clear but not harsh
      - Disappointed but not attacking
      - Specific but not inflammatory
      
      TRANSFORMATION EXAMPLES:
      - "This is absolute garbage" → "I'm quite disappointed with this"
      - "You guys are incompetent" → "I've experienced some service issues"
      - "Fix this now or I'm leaving" → "I'd appreciate if this could be resolved soon"
      - "Worst service ever" → "The service hasn't met my expectations"
      - "You people are idiots" → "I'm concerned about the quality of service"
      - "Complete waste of money" → "I don't feel I received good value"
      
      KEEP THE CUSTOMER'S VOICE:
      - Use "I" statements (I experienced, I noticed, I would like)
      - Keep their requests and concerns
      - Maintain their timeline expectations
      - Preserve specific details they mentioned
      
      DO NOT:
      - Write a response or reply to the feedback
      - Draft what the business owner should say back
      - Switch perspectives from customer to business
      - Make the feedback completely positive if serious issues exist
      - Remove important details about problems
      - Add false praise that wasn't in the original
      - Change the fundamental message or concern
      - Make unreasonable complaints seem reasonable
      - Use phrases like "we should" or "you could" (business response language)
      - Start with "Thank you for", "We apologize", or similar business language`
            },
            {
              role: "user",
              content: `Please transform the following customer feedback into a more constructive, friendly, and professional version while preserving all factual content and legitimate concerns:
      
      IMPORTANT: You are rewriting the CUSTOMER'S message only. Do NOT write a business response or reply. Transform the customer's original words into a gentler version from the same customer perspective.
      
      ORIGINAL CUSTOMER FEEDBACK:
      "${emailContent}"
      
      Please provide a more friendly softened version that:
      1. Maintains all specific issues and problems mentioned
      2. Removes personal attacks and harsh language
      3. Uses professional, constructive tone
      4. Preserves the customer's desired resolution
      5. Keeps the appropriate level of urgency for the situation
      6. STAYS IN THE CUSTOMER'S VOICE - do not switch to business perspective
      
      SOFTENED CUSTOMER FEEDBACK:`
            }
          ],
          temperature: 0.7,
          max_tokens: 1000,
        });
        
        transformedText = completion.choices[0]?.message?.content || emailContent;
        wasTransformed = transformedText !== emailContent;
        
      } catch (error) {
        logger.error("Error transforming feedback with OpenAI:", error);
        transformedText = emailContent; // Fallback to original
      }
      
      const processingTime = Date.now() - startTime;

      // Create the feedback document
      const feedbackData = {
        businessId: business.id,
        userId: business.businessOwner,
        originalText: emailContent,
        transformedText: transformedText,
        senderEmail: emailData.FromFull.Email,
        senderName: emailData.FromFull.Name || "",
        subject: emailData.Subject || "No Subject",
        receivedAt: admin.firestore.Timestamp.now(),
        processedAt: admin.firestore.Timestamp.now(),
        sentiment: {
          original: { score: 0, label: "pending" },
          transformed: { score: 0, label: "pending" },
        },
        metadata: {
          postmarkMessageId: emailData.MessageID,
          transformationModel: "gpt-4o-mini",
          processingTime: processingTime,
          wasTransformed: wasTransformed,
        },
        status: "unread" as const,
        tags: [],
      };

      // Store the feedback as a subcollection of the business
      const businessDocPath = `users/${business.businessOwner}/businesses/`;
      await admin.firestore()
        .collection(businessDocPath)
        .doc(business.id)
        .collection("feedback")
        .add(feedbackData);

      response.status(200).send("OK");
    } catch (error) {
      logger.error("Error processing inbound email", error);
      response.status(500).send("Internal Server Error");
    }
  }
);


// MARK: - Inbound Email Webhook
export const inboundEmailWebhook = onRequest(async (request, response) => {

    response.header("Content-Type", "application/json");
    response.header("Access-Control-Allow-Origin", "*");
    response.header("Access-Control-Allow-Headers", "Content-Type");
    
    corsHandler(request, response, async () => {

      const body = request.body; 
      // Extract businessId from email address (everything before @)
      const publicId = body.OriginalRecipient.split('@')[0].split('+')[1];

      let business = null;
      try {
        const usersSnapshot = await db.collection("users").get();
        
        // groupCollection was giving me issues, so I'm using this for now.
        for (const userDoc of usersSnapshot.docs) {
          const businessesSnapshot = await userDoc.ref.collection("businesses").where("id", "==", publicId).limit(1).get();
          
          if (!businessesSnapshot.empty) {
            business = businessesSnapshot.docs[0].data();
            break;
          }
        }
        
        if (!business) {
          logger.error("No Business Found for businessId: ", publicId);
          return response.status(200).send();
        }
        
      } catch (searchError) {
        logger.error("Error during business search:", searchError);
        return response.status(500).send();
      }

      // Call the cloud function handleInboundEmail to transform the email
      const functionUrl = `https://us-central1-gentle-inbox.cloudfunctions.net/handleInboundEmail`;
      
      const data = {
        business: business,
        body: body,
      }

      try {
         axios.post(functionUrl, data, {
          headers: {
            'Content-Type': 'application/json',
          }
        });
        logger.log("Successfully forwarded to handleInboundEmail");
      } catch (error) {
        logger.error("Error calling handleInboundEmail:", error);
      }

      return response.status(200).send();

    });
});