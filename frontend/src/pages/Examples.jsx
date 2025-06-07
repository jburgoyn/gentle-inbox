import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ArrowLeft, UtensilsCrossed, Wrench, Camera, Star, MessageCircle, ChevronDown, ChevronUp } from 'lucide-react';

const feedbackExamples = {
  restaurant: {
    title: "Restaurant & Café",
    icon: UtensilsCrossed,
    examples: [
      {
        level: "Mildly Disappointed",
        original: "The pasta was a bit overcooked tonight and my coffee was lukewarm when it arrived. Usually you guys are spot on, so maybe just an off night? The service was still friendly though.",
        transformed: "I noticed the pasta seemed a bit overcooked and the coffee wasn't as hot as usual tonight. I know you typically maintain excellent standards, so I wanted to share this feedback. The service team was lovely as always."
      },
      {
        level: "Constructively Critical", 
        original: "I enjoyed my meal overall, but the wait time was longer than expected for a Tuesday night. Also, the salad dressing seemed watered down. Your staff was apologetic though, which I appreciated.",
        transformed: "Thank you for a pleasant dining experience overall. I wanted to mention that the wait time was a bit longer than anticipated, and the salad dressing seemed lighter than usual. I appreciated how understanding your staff was about the timing."
      },
      {
        level: "Quite Harsh",
        original: "The steak was completely inedible - tough as leather and stone cold. For $35, this is absolutely unacceptable. The server seemed annoyed when I complained. This used to be a good restaurant.",
        transformed: "I was disappointed with my steak tonight as it arrived quite tough and cool. Given the price point, I expected better quality. I also felt the server could have been more receptive to my concerns. I've had great experiences here before and hope this was just an off night."
      },
      {
        level: "Very Aggressive",
        original: "What a complete disaster of a meal. Cold food, rude waitstaff, and disgusting bathroom facilities. This place has gone completely downhill and isn't worth the money you charge for garbage.",
        transformed: "I had a very disappointing experience tonight. The food arrived cold, the service felt unwelcoming, and the restroom facilities need attention. I feel the value doesn't match the current quality, which is concerning given my previous positive experiences here."
      },
      {
        level: "Extremely Harsh",
        original: "You morons can't even get a simple order right. Worst food, worst service, worst management I've ever encountered. Close this dump before you kill someone with your disgusting food.",
        transformed: "I'm very frustrated with multiple order errors and the overall quality of food and service tonight. This experience falls far short of my expectations for dining out, and I'm concerned about food safety standards. I hope management can address these serious issues."
      }
    ]
  },
  plumbing: {
    title: "Plumbing Services",
    icon: Wrench,
    examples: [
      {
        level: "Mildly Disappointed",
        original: "The leak is fixed, but you left some water damage on my ceiling that wasn't there before. Could you please come back and take a look? The repair itself seems solid though.",
        transformed: "Thank you for fixing the leak - the repair looks solid. I noticed some new water damage on my ceiling that wasn't there before the work. Would it be possible for someone to assess this when convenient? I appreciate your attention to this matter."
      },
      {
        level: "Frustrated but Reasonable",
        original: "I scheduled this appointment three weeks ago and you're already 2 hours late with no call. I took time off work for this. Better communication would really help your customers plan.",
        transformed: "I'm concerned about the significant delay for my appointment that was scheduled three weeks ago. Since I arranged time off work for this, advance communication about delays would be very helpful for future scheduling."
      },
      {
        level: "Quite Harsh",
        original: "You charged me $400 to fix a simple clog and now my toilet is leaking worse than before. This is highway robbery and incompetent work. I want someone else to come fix your mess.",
        transformed: "I'm disappointed that after paying $400 for clog repair, my toilet is now leaking more than before the service. I feel the pricing was high for the work performed, and I'd like a different technician to address the new issues that have developed."
      },
      {
        level: "Very Aggressive", 
        original: "Absolute rip-off artists! You people have no clue what you're doing and charge ridiculous prices for shoddy work. My pipes are worse now than when you started.",
        transformed: "I'm very frustrated with both the pricing and quality of work. The plumbing issues have actually worsened since the service call, which is the opposite of what I expected. I need this situation resolved properly and feel the current charges don't reflect the value received."
      },
      {
        level: "Extremely Harsh",
        original: "You incompetent hacks flooded my basement and caused thousands in damage. This is the most unprofessional, destructive service I've ever seen. You have no business touching anyone's plumbing.",
        transformed: "I'm extremely concerned about the significant basement flooding that occurred during your service, resulting in substantial property damage. This level of damage from a plumbing service is unacceptable and needs immediate resolution. I question whether proper procedures were followed."
      }
    ]
  },
  photography: {
    title: "Wedding Photography",
    icon: Camera,
    examples: [
      {
        level: "Mildly Disappointed",
        original: "Most of the photos turned out beautifully, but I noticed you missed capturing the cake cutting and some key family shots we discussed. The editing style is lovely though.",
        transformed: "Thank you for the beautiful photos and lovely editing style. I wanted to mention that the cake cutting and some family shots from our discussion don't appear to be in the gallery. Could you check if these moments were captured?"
      },
      {
        level: "Constructively Critical",
        original: "The photos are nice overall, but many of the reception shots are quite dark and grainy. Also, it took 8 weeks to get them back when you promised 4-6 weeks.",
        transformed: "I appreciate the overall quality of the photos. I wanted to share feedback that many reception shots appear darker and grainier than expected, and the delivery took longer than the promised timeframe. Understanding if there were technical challenges would be helpful."
      },
      {
        level: "Quite Harsh",
        original: "Half the photos are blurry or poorly composed, and you completely missed our first dance. For $3,000, this is unacceptable work. These photos are supposed to be once-in-a-lifetime memories.",
        transformed: "I'm disappointed with the photo quality, as many appear blurry or poorly framed, and our first dance wasn't captured. Given the investment of $3,000 and the irreplaceable nature of these memories, I expected higher technical standards."
      },
      {
        level: "Very Aggressive",
        original: "What a waste of money! You ruined our wedding photos with terrible lighting and missed all the important shots. We'll never get these moments back and you completely failed us.",
        transformed: "I'm devastated by the photo results. The lighting issues and missing key moments have left us without the wedding memories we expected. Since these moments can't be recreated, this outcome is particularly heartbreaking for us."
      },
      {
        level: "Extremely Harsh",
        original: "You single-handedly destroyed our wedding memories with the most amateur, unprofessional photography I've ever seen. These photos are unusable garbage and you should be ashamed.",
        transformed: "I'm deeply disappointed with the photography results from our wedding. The technical quality falls far below professional standards, leaving us with unusable images of our special day. This outcome is devastating as these memories cannot be replaced."
      }
    ]
  }
};

export default function Examples() {
  const [selectedCategory, setSelectedCategory] = useState('restaurant');
  const [expandedExample, setExpandedExample] = useState(null);

  const getSeverityColor = (level) => {
    if (level.includes('Mildly') || level.includes('Constructively')) return 'bg-green-100 text-green-800';
    if (level.includes('Frustrated') || level.includes('Quite')) return 'bg-yellow-100 text-yellow-800';
    if (level.includes('Very') || level.includes('Extremely')) return 'bg-red-100 text-red-800';
    return 'bg-gray-100 text-gray-800';
  };

  const toggleExample = (index) => {
    setExpandedExample(expandedExample === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-amber-50 to-orange-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="bg-amber-600 rounded-lg p-2">
                <Heart className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">gentle inbox</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <Link to="/login" className="text-gray-700 hover:text-gray-900 transition-colors text-sm font-medium">
                Login
              </Link>
              <Link to="/signup" className="bg-amber-600 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-amber-700 transition-colors">
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Link */}
        <div className="mb-8">
          <Link
            to="/"
            className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
        </div>

        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            See the Magic in Action
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Explore real examples of how our AI transforms harsh customer feedback into constructive, 
            emotionally-safe messages while preserving all the valuable insights.
          </p>
        </div>

        {/* Category Selector */}
        <div className="flex justify-center mb-12">
          <div className="bg-white rounded-xl p-2 shadow-lg border border-gray-200">
            {Object.entries(feedbackExamples).map(([key, category]) => {
              const IconComponent = category.icon;
              return (
                <button
                  key={key}
                  onClick={() => setSelectedCategory(key)}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-lg transition-colors ${
                    selectedCategory === key
                      ? 'bg-amber-100 text-amber-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <IconComponent className="h-5 w-5" />
                  <span className="font-medium">{category.title}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Examples */}
        <div className="space-y-6">
          {feedbackExamples[selectedCategory].examples.map((example, index) => (
            <div key={index} className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getSeverityColor(example.level)}`}>
                      {example.level}
                    </span>
                    <Star className="h-4 w-4 text-yellow-500" />
                  </div>
                  <button
                    onClick={() => toggleExample(index)}
                    className="flex items-center space-x-2 text-amber-600 hover:text-amber-700 transition-colors"
                  >
                    <span className="text-sm font-medium">
                      {expandedExample === index ? 'Hide Comparison' : 'Show Comparison'}
                    </span>
                    {expandedExample === index ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </button>
                </div>

                {/* Gentle Version (Always Visible) */}
                <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-4">
                  <div className="flex items-center space-x-2 mb-3">
                    <MessageCircle className="h-5 w-5 text-green-600" />
                    <span className="font-semibold text-green-800">Gentle Version</span>
                  </div>
                  <p className="text-gray-900 leading-relaxed">{example.transformed}</p>
                </div>

                {/* Original Version (Expandable) */}
                {expandedExample === index && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                    <div className="flex items-center space-x-2 mb-3">
                      <MessageCircle className="h-5 w-5 text-red-600" />
                      <span className="font-semibold text-red-800">Original Message</span>
                    </div>
                    <p className="text-gray-900 leading-relaxed">{example.original}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-16 bg-gradient-to-r from-amber-600 to-orange-600 rounded-2xl p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to Protect Your Mental Health?</h2>
          <p className="text-xl mb-8 text-amber-100">
            Start receiving gentler feedback today and focus on growing your business instead of recovering from harsh criticism.
          </p>
          <Link
            to="/signup"
            className="bg-white text-amber-700 px-8 py-4 rounded-full text-lg font-semibold hover:bg-amber-50 transition-colors shadow-lg"
          >
            Get Started Free
          </Link>
        </div>
      </div>
    </div>
  );
}