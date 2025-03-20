import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Share,
  Modal,
  ScrollView,
} from 'react-native';
import { useErrorStore, ErrorLog, formatError, getErrorTypeColor } from '../services/ErrorHandler';

interface ErrorLogItemProps {
  error: ErrorLog;
  onPress: () => void;
}

const ErrorLogItem: React.FC<ErrorLogItemProps> = ({ error, onPress }) => (
  <TouchableOpacity onPress={onPress} style={styles.logItem}>
    <View style={[styles.typeIndicator, { backgroundColor: getErrorTypeColor(error.type) }]} />
    <View style={styles.logContent}>
      <Text style={styles.timestamp}>
        {new Date(error.timestamp).toLocaleString()}
      </Text>
      <Text style={styles.source}>{error.source}</Text>
      <Text style={styles.message} numberOfLines={2}>
        {error.message}
      </Text>
    </View>
  </TouchableOpacity>
);

interface ErrorDetailsModalProps {
  error: ErrorLog | null;
  visible: boolean;
  onClose: () => void;
}

const ErrorDetailsModal: React.FC<ErrorDetailsModalProps> = ({ error, visible, onClose }) => {
  if (!error) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Error Details</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>×</Text>
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.modalBody}>
            <Text style={styles.detailLabel}>Timestamp:</Text>
            <Text style={styles.detailText}>
              {new Date(error.timestamp).toLocaleString()}
            </Text>

            <Text style={styles.detailLabel}>Type:</Text>
            <Text style={[styles.detailText, { color: getErrorTypeColor(error.type) }]}>
              {error.type.toUpperCase()}
            </Text>

            <Text style={styles.detailLabel}>Source:</Text>
            <Text style={styles.detailText}>{error.source}</Text>

            <Text style={styles.detailLabel}>Message:</Text>
            <Text style={styles.detailText}>{error.message}</Text>

            {error.stack && (
              <>
                <Text style={styles.detailLabel}>Stack Trace:</Text>
                <Text style={styles.stackTrace}>{error.stack}</Text>
              </>
            )}

            {error.metadata && (
              <>
                <Text style={styles.detailLabel}>Metadata:</Text>
                <Text style={styles.detailText}>
                  {JSON.stringify(error.metadata, null, 2)}
                </Text>
              </>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export const ErrorLogViewer: React.FC = () => {
  const { errors, clearLogs, exportLogs } = useErrorStore();
  const [selectedError, setSelectedError] = useState<ErrorLog | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const handleShare = async () => {
    try {
      const logs = await exportLogs();
      await Share.share({
        message: logs,
        title: 'Error Logs',
      });
    } catch (error) {
      console.error('Failed to share logs:', error);
    }
  };

  const handleErrorPress = (error: ErrorLog) => {
    setSelectedError(error);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedError(null);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Error Logs</Text>
        <View style={styles.actions}>
          <TouchableOpacity onPress={handleShare} style={styles.actionButton}>
            <Text style={styles.actionButtonText}>Share</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={clearLogs} style={[styles.actionButton, styles.clearButton]}>
            <Text style={styles.actionButtonText}>Clear</Text>
          </TouchableOpacity>
        </View>
      </View>

      {errors.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>No errors logged</Text>
        </View>
      ) : (
        <FlatList
          data={errors}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ErrorLogItem error={item} onPress={() => handleErrorPress(item)} />
          )}
          style={styles.list}
        />
      )}

      <ErrorDetailsModal
        error={selectedError}
        visible={modalVisible}
        onClose={handleCloseModal}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  actions: {
    flexDirection: 'row',
  },
  actionButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
    backgroundColor: '#007AFF',
    marginLeft: 8,
  },
  clearButton: {
    backgroundColor: '#FF3B30',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  list: {
    flex: 1,
  },
  logItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 8,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  typeIndicator: {
    width: 4,
  },
  logContent: {
    flex: 1,
    padding: 12,
  },
  timestamp: {
    fontSize: 12,
    color: '#666',
  },
  source: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 4,
  },
  message: {
    fontSize: 14,
    color: '#333',
    marginTop: 4,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 16,
    color: '#666',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    padding: 16,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 4,
  },
  closeButtonText: {
    fontSize: 24,
    color: '#666',
  },
  modalBody: {
    padding: 16,
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginTop: 12,
    marginBottom: 4,
  },
  detailText: {
    fontSize: 14,
    color: '#333',
  },
  stackTrace: {
    fontSize: 12,
    color: '#666',
    fontFamily: 'monospace',
    backgroundColor: '#f5f5f5',
    padding: 8,
    borderRadius: 4,
  },
});

export default ErrorLogViewer; 