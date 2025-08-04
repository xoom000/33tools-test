import { motion } from 'framer-motion';

const TokenTypeSelector = ({ onTypeSelect }) => {
  const tokenTypes = [
    {
      id: 'customer',
      title: 'Customer Token',
      description: 'Generate login codes for customers to access their portal',
      hoverColor: 'hover:border-primary-300 hover:bg-primary-50'
    },
    {
      id: 'driver',
      title: 'Driver Setup Token',
      description: 'One-time tokens for drivers to create their accounts',
      hoverColor: 'hover:border-green-300 hover:bg-green-50'
    },
    {
      id: 'demo',
      title: 'Demo Token',
      description: 'Time-limited access for demonstrations and testing',
      hoverColor: 'hover:border-purple-300 hover:bg-purple-50'
    }
  ];

  return (
    <motion.div
      key="selection"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <p className="text-slate-600 text-center">
        Choose the type of access token to generate:
      </p>

      <div className="grid gap-4">
        {tokenTypes.map((type) => (
          <motion.button
            key={type.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onTypeSelect(type.id)}
            className={`p-6 border-2 border-slate-200 rounded-xl ${type.hoverColor} transition-all text-left`}
          >
            <div>
              <h3 className="text-lg font-semibold text-slate-800">{type.title}</h3>
              <p className="text-slate-600 text-sm">{type.description}</p>
            </div>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
};

export default TokenTypeSelector;