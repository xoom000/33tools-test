import { motion } from 'framer-motion';
import { Button } from '../../ui';
import { VARIANTS } from '../../../theme';
import { AnimatedContainer } from '../../animations';

const ItemsGrid = ({ 
  items = [],
  title = "Your Regular Items",
  emptyStateIcon = "📦",
  emptyStateMessage = "No regular items found.",
  onSubmitOrder,
  loading = false,
  submitButtonText = "Submit Order Request",
  submitPrompt = "Ready to request these items for your next delivery?",
  className = ""
}) => {
  return (
    <AnimatedContainer
      variant="slideUp"
      delay={0.1}
      className={`${VARIANTS.card.base} p-6 ${className}`}
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-slate-800">{title}</h2>
        <span className="text-sm text-slate-500">{items.length} items</span>
      </div>

      {items.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item, index) => (
            <AnimatedContainer
              key={item.id}
              variant="stagger"
              delay={0.1 + index * 0.05}
              className="group bg-slate-100 rounded-xl p-4 hover:bg-slate-200 transition-all duration-200 cursor-pointer border border-slate-200/50"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-medium text-slate-800 group-hover:text-slate-900 transition-colors">
                    {item.description}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">#{item.item_number}</p>
                </div>
                <span className="text-lg font-semibold text-slate-700 ml-3">
                  {item.quantity}
                </span>
              </div>
              
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 capitalize">{item.item_type}</span>
                <span className="text-slate-500">{item.unit_of_measure}</span>
              </div>
            </AnimatedContainer>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <div className="text-slate-400 text-4xl mb-3">{emptyStateIcon}</div>
          <p className="text-slate-600">{emptyStateMessage}</p>
        </div>
      )}

      {/* Submit Order Button */}
      {items.length > 0 && onSubmitOrder && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-6 p-4 bg-slate-50 rounded-xl border border-slate-200/50"
        >
          <div className="text-center">
            <p className="text-slate-600 text-sm mb-4">
              {submitPrompt}
            </p>
            <Button 
              variant="primary" 
              size="medium"
              onClick={onSubmitOrder}
              disabled={loading}
            >
              {loading ? 'Submitting...' : submitButtonText}
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatedContainer>
  );
};

export default ItemsGrid;