import React from 'react'

const AboutUs = () => {
  return (
    <div id="about" className="bg-white py-16 px-6 sm:px-12 md:px-24 lg:px-32 text-gray-800">
    <div className="max-w-5xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-purple-700 mb-6">About Us</h2>
        <p className="text-lg leading-relaxed mb-3">
            Welcome to our decentralized charity donation platform! Powered by blockchain, we ensure security, transparency, and a global reach, allowing donors and beneficiaries to connect directly and securely.
        </p>
        <p className="text-lg leading-relaxed mb-8">
            Our mission is to create a community-driven ecosystem that supports impactful initiatives. Through our platform, owners can launch a campaign and attract support from people worldwide.
        </p>
    </div>

    <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {[
            { title: "Charity Fundraising", text: "Raise funds for non-profits and charities, with every transaction tracked and verified on the blockchain for transparency." },
            { title: "Disaster Relief", text: "Quickly mobilize funds for emergencies and natural disasters, enabling fast support for those in urgent need." },
            { title: "Community Projects", text: "Support local initiatives, from park renovations to community education programs, and bring change to your neighborhood." },
            { title: "Medical Fundraising", text: "Fund medical emergencies with transparency and accountability, ensuring every dollar goes to those in need." },
            { title: "Educational Campaigns", text: "Help fund scholarships, school infrastructure, and educational resources to foster learning and growth." },
            { title: "Environmental Initiatives", text: "Support conservation efforts, like reforestation and wildlife protection, to create a healthier planet." }
        ].map((card, index) => (
            <div key={index} className="bg-purple-100 rounded-lg p-6 shadow-md">
                <h3 className="text-xl font-semibold text-purple-700 mb-2">{card.title}</h3>
                <p className="text-gray-700">{card.text}</p>
            </div>
        ))}
    </div>
</div>
  )
}

export default AboutUs