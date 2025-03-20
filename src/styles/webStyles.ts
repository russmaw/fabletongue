import { StyleSheet, Platform, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const isTablet = width >= 768;

export const webStyles = StyleSheet.create({
  container: {
    flex: 1,
    maxWidth: isTablet ? 1200 : '100%',
    marginHorizontal: 'auto',
    width: '100%',
  },
  content: {
    flex: 1,
    padding: isTablet ? 20 : 16,
  },
  header: {
    padding: isTablet ? 20 : 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  navigation: {
    flexDirection: 'row',
    justifyContent: 'center',
    padding: isTablet ? 10 : 8,
  },
  navButton: {
    padding: isTablet ? 10 : 8,
    marginHorizontal: isTablet ? 5 : 3,
    borderRadius: 5,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: isTablet ? 20 : 16,
    marginVertical: isTablet ? 10 : 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    padding: isTablet ? 10 : 8,
    marginVertical: 5,
    fontSize: isTablet ? 16 : 14,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: isTablet ? 12 : 10,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: isTablet ? 16 : 14,
    fontWeight: '600',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginHorizontal: isTablet ? 0 : -8,
  },
  gridItem: {
    width: isTablet ? '48%' : '100%',
    marginBottom: isTablet ? 20 : 16,
    paddingHorizontal: isTablet ? 0 : 8,
  },
  responsiveText: {
    fontSize: isTablet ? 16 : 14,
    lineHeight: isTablet ? 24 : 20,
  },
  responsiveTitle: {
    fontSize: isTablet ? 24 : 20,
    fontWeight: 'bold',
    marginBottom: isTablet ? 10 : 8,
  },
  modal: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: isTablet ? 20 : 16,
    maxWidth: isTablet ? 500 : '95%',
    width: isTablet ? '90%' : '100%',
    margin: 'auto',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  // New tablet-specific styles
  tabletContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  tabletSidebar: {
    width: isTablet ? '25%' : '100%',
    padding: isTablet ? 16 : 0,
  },
  tabletMainContent: {
    width: isTablet ? '75%' : '100%',
    padding: isTablet ? 16 : 0,
  },
  // Touch-friendly styles
  touchTarget: {
    minHeight: 44, // iOS minimum touch target size
    minWidth: 44,
    padding: 8,
  },
}); 