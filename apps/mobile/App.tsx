import { Text, View } from 'react-native';
import { hello } from '@thepregames/shared';

export default function App() {
  return (
    <View style={{ padding: 24, marginTop: 64 }}>
      <Text style={{ fontSize: 24, fontWeight: '600' }}>thepregames — Mobile</Text>
      <Text>{hello()}</Text>
    </View>
  );
}
