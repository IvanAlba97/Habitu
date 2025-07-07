
import React from 'react';
import { View, Text, StyleSheet, ScrollView, Button } from 'react-native';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Uncaught error:", error, errorInfo);
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.container}>
          <Text style={styles.title}>Algo salió mal</Text>
          <Text style={styles.subtitle}>La aplicación encontró un error y no puede continuar.</Text>
          <ScrollView style={styles.scroll}>
            <Text style={styles.errorTitle}>Detalles del Error:</Text>
            <Text style={styles.errorText}>
              {this.state.error && this.state.error.toString()}
            </Text>
            <Text style={styles.errorInfoText}>
              {this.state.errorInfo && this.state.errorInfo.componentStack}
            </Text>
          </ScrollView>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1c1c1e',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ff453a',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#aeaeae',
    textAlign: 'center',
    marginBottom: 20,
  },
  scroll: {
    width: '100%',
    backgroundColor: '#2c2c2e',
    borderRadius: 8,
    padding: 15,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ff453a',
    marginBottom: 10,
  },
  errorText: {
    color: '#f2f2f7',
    fontSize: 14,
    marginBottom: 15,
  },
  errorInfoText: {
    color: '#8e8e93',
    fontSize: 12,
  },
});

export default ErrorBoundary;
