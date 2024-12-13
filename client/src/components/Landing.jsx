import { useNavigate } from 'react-router-dom';
import home from '../assets/home.jpg';

const LandingSection = () => {
    const navigate = useNavigate();

    return (
        <div
            className="min-h-screen flex items-center justify-center relative"
            style={{
                backgroundImage: `url(${home})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                filter: 'brightness(0.7)',
            }}
        >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-purple-600 opacity-30"></div>
            <div className="relative text-center px-6 md:px-12">
                <h1 className="text-4xl md:text-5xl font-bold text-purple-300 mb-6 drop-shadow-lg">
                    Welcome to CharityChain
                </h1>
                <p className="text-white text-lg md:text-xl mb-16 font-bold  drop-shadow-md">
                    Join our community and make your ideas come to life. Start a campaign to bring change and gather support from people who care.
                </p>
            </div>
        </div>
    );
};

export default LandingSection;
