
import { useNavigate } from 'react-router-dom';
const LandingSection = () => {
    const navigate=useNavigate();
    return (
        <div  className="min-h-screen bg-gradient-to-br from-purple-50 via-purple-300 flex items-center justify-center">
            <div>
                <h1 className="text-3xl font-bold text-purple-700 mb-4">Welcome to CrowdSprout</h1>
                <p className="text-gray-700 mb-6">
                    Join our community and make your ideas come to life. Start a campaign to bring change and gather support from people who care.
                </p>
                
                   
               
            </div>
        </div>
    );
};

export default LandingSection;