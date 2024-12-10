import React from 'react'

const ContactUs = () => {
  return (
    <div id="contact" className="bg-black text-white py-16 px-8 sm:px-12 md:px-20 lg:px-28">
    <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-6">Contact Us</h2>
        <p className="text-gray-400 mb-8">
            Feel free to reach out to us via any of these platforms. We’re here to assist!
        </p>

        <div className="flex justify-center space-x-8">
            <a href="/" className="hover:scale-110 transition duration-300">
                <button className="p-3 rounded-full bg-indigo-600 hover:bg-indigo-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M4.5 4h15A2.5 2.5 0 0 1 22 6.5v11A2.5 2.5 0 0 1 19.5 20h-15A2.5 2.5 0 0 1 2 17.5v-11A2.5 2.5 0 0 1 4.5 4zm0 2a.5.5 0 0 0-.5.5v.8l8 4.8 8-4.8v-.8a.5.5 0 0 0-.5-.5h-15zm0 2.8v7.7a.5.5 0 0 0 .5.5h15a.5.5 0 0 0 .5-.5v-7.7l-7.75 4.65a1 1 0 0 1-1 0L4.5 8.8z" />
                    </svg>
                </button>
            </a>

            <a href="/" target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition duration-300">
                <button className="p-3 rounded-full bg-gray-800 hover:bg-gray-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M23 3c-.8.4-1.6.7-2.4.9 1-.6 1.5-1.6 1.8-2.7-.8.5-1.7.8-2.6 1C19.2 1.3 18 1 17 1c-2.5 0-4.6 2-4.6 4.6 0 .4 0 .7.1 1C8.3 6.4 4.4 4.6 1.6 1.6c-.4.7-.6 1.6-.6 2.5 0 1.7.9 3.3 2.3 4.2-.8 0-1.5-.2-2.2-.6 0 2.4 1.7 4.4 4 4.8-.4.1-.8.2-1.2.2-.3 0-.6 0-.9-.1.6 2 2.3 3.5 4.4 3.5-1.6 1.3-3.5 2-5.5 2H3c2.3 1.5 5 2.3 7.9 2.3C16.4 21 20.3 13 20.3 8c0-.2 0-.4 0-.5 1-.7 1.8-1.5 2.5-2.5-.9.4-1.9.6-2.9.8z" />
                    </svg>
                </button>
            </a>

            <a href="/" className="hover:scale-110 transition duration-300">
                <button className="p-3 rounded-full bg-green-500 hover:bg-green-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M21 15.46v3.68a2.35 2.35 0 0 1-2.56 2.35 19.85 19.85 0 0 1-8.63-3.58 19.65 19.65 0 0 1-5.34-5.34 19.85 19.85 0 0 1-3.58-8.63A2.35 2.35 0 0 1 4.86 3h3.68a2.35 2.35 0 0 1 2.35 2.03c.1.86.31 1.7.63 2.5a2.35 2.35 0 0 1-.53 2.48L9.09 11.9a16.93 16.93 0 0 0 5.34 5.34l1.89-1.89a2.35 2.35 0 0 1 2.48-.53c.8.32 1.64.53 2.5.63a2.35 2.35 0 0 1 2.03 2.34z" />
                    </svg>
                </button>
            </a>

            <a href="/" target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition duration-300">
                <button className="p-3 rounded-full bg-pink-500 hover:bg-pink-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2.2c3.2 0 3.6 0 4.8.1 1.2.1 1.9.2 2.4.4.6.2 1.1.5 1.6 1 .5.5.8 1 1 1.6.2.5.4 1.2.4 2.4.1 1.2.1 1.6.1 4.8s0 3.6-.1 4.8c-.1 1.2-.2 1.9-.4 2.4-.2.6-.5 1.1-1 1.6-.5.5-1 .8-1.6 1-.5.2-1.2.4-2.4.4-1.2.1-1.6.1-4.8.1s-3.6 0-4.8-.1c-1.2-.1-1.9-.2-2.4-.4-.6-.2-1.1-.5-1.6-1-.5-.5-.8-1-1-1.6-.2-.5-.4-1.2-.4-2.4C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.8c.1-1.2.2-1.9.4-2.4.2-.6.5-1.1 1-1.6.5-.5 1-.8 1.6-1 .5-.2 1.2-.4 2.4-.4 1.2-.1 1.6-.1 4.8-.1zm0 1.8c-3.2 0-3.6 0-4.7.1-.9.1-1.4.3-1.8.6-.4.3-.7.6-1 .9-.3.3-.6.6-.9 1-.3.4-.5.9-.6 1.8-.1 1.1-.1 1.5-.1 4.7s0 3.6.1 4.7c.1.9.3 1.4.6 1.8.3.4.6.7.9 1 .3.3.6.6 1 .9.4.3.9.5 1.8.6 1.1.1 1.5.1 4.7.1s3.6 0 4.7-.1c.9-.1 1.4-.3 1.8-.6.4-.3.7-.6 1-.9.3-.3.6-.6.9-1 .3-.4.5-.9.6-1.8.1-1.1.1-1.5.1-4.7s0-3.6-.1-4.7c-.1-.9-.3-1.4-.6-1.8-.3-.4-.6-.7-.9-1-.3-.3-.6-.6-1-.9-.4-.3-.9-.5-1.8-.6-1.1-.1-1.5-.1-4.7-.1zm0 3.7a5.5 5.5 0 1 1 0 11 5.5 5.5 0 0 1 0-11zm0 1.8a3.7 3.7 0 1 0 0 7.5 3.7 3.7 0 0 0 0-7.5zm5.4-2.4a1.3 1.3 0 1 1-2.6 0 1.3 1.3 0 0 1 2.6 0z"/>
                    </svg>
                 </button>
            </a>
        </div>
    </div>
</div>

  )
}

export default ContactUs