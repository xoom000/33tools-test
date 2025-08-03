import { motion } from 'framer-motion';
import { Button } from '../../ui';
import logger from '../../../utils/logger';

const TokenResult = ({ generatedToken, onGenerateAnother, onClose }) => {
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      logger.info('Token copied to clipboard');
      // Could add a toast notification here
    });
  };

  return (
    <motion.div
      key="result"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="text-center">
        <h3 className="text-xl font-semibold text-slate-800 mb-2">
          {generatedToken.type} Token Generated!
        </h3>
        <p className="text-slate-600">{generatedToken.instructions}</p>
      </div>

      {/* Token Details */}
      <div className="bg-slate-50 rounded-xl p-6 space-y-4">
        <div className="text-center">
          <label className="block text-sm font-medium text-slate-700 mb-2">Token Code</label>
          <div className="flex items-center gap-2">
            <code className="flex-1 bg-white border rounded-lg px-4 py-3 text-lg font-mono text-center text-slate-800">
              {generatedToken.token}
            </code>
            <Button
              variant="ghost"
              size="small"
              onClick={() => copyToClipboard(generatedToken.token)}
            >
              Copy
            </Button>
          </div>
        </div>

        {generatedToken.url && (
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Access URL</label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={generatedToken.url}
                readOnly
                className="flex-1 bg-white border rounded-lg px-3 py-2 text-sm text-slate-600"
              />
              <Button
                variant="ghost"
                size="small"
                onClick={() => copyToClipboard(generatedToken.url)}
              >
                Copy
              </Button>
            </div>
          </div>
        )}

        {/* Additional Details */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          {generatedToken.customerName && (
            <div>
              <span className="font-medium text-slate-700">Customer:</span>
              <p className="text-slate-600">{generatedToken.customerName}</p>
            </div>
          )}
          {generatedToken.driverName && (
            <div>
              <span className="font-medium text-slate-700">Driver:</span>
              <p className="text-slate-600">{generatedToken.driverName}</p>
            </div>
          )}
          {generatedToken.routeNumber && (
            <div>
              <span className="font-medium text-slate-700">Route:</span>
              <p className="text-slate-600">{generatedToken.routeNumber}</p>
            </div>
          )}
          {generatedToken.expiresAt && (
            <div>
              <span className="font-medium text-slate-700">Expires:</span>
              <p className="text-slate-600">{new Date(generatedToken.expiresAt).toLocaleString()}</p>
            </div>
          )}
          {generatedToken.timeLimit && (
            <div>
              <span className="font-medium text-slate-700">Duration:</span>
              <p className="text-slate-600">{generatedToken.timeLimit}</p>
            </div>
          )}
        </div>
      </div>

      <div className="flex gap-3">
        <Button variant="secondary" onClick={onGenerateAnother} className="flex-1">
          Generate Another
        </Button>
        <Button variant="primary" onClick={onClose} className="flex-1">
          Done
        </Button>
      </div>
    </motion.div>
  );
};

export default TokenResult;