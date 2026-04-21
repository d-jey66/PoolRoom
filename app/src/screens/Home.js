import { View, Text, ScrollView, Image, TouchableOpacity, Linking } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { Calendar, Clock, MapPin, Phone, Mail, Star } from "lucide-react-native";
import { useAuth } from "../context/authContext";

const HERO_IMAGE = "https://images.unsplash.com/photo-1599685315659-bc876da49fe5?q=80&w=1740&auto=format&fit=crop";

const tables = [
  {
    id: 2,
    name: "Standard Table",
    image: "https://images.unsplash.com/photo-1611095565368-30e4b7a58b8e?w=600&auto=format",
    description: "Classic 8ft table perfect for casual games",
    features: [
      "Quality felt surface",
      "Standard equipment",
      "Great for beginners",
    ],
  },
  {
    id: 3,
    name: "VIP Lounge Table",
    image: "https://images.unsplash.com/photo-1570623289014-e9f6a2ac82ef?w=600&auto=format",
    description: "Private area with premium table and seating",
    features: [
      "Private space",
      "Bottle service",
      "Exclusive atmosphere",
    ],
  },
];

const features = [
  {
    icon: Star,
    title: "Premium Tables",
    description: "Tournament-grade tables with championship cloth for the perfect game",
  },
  {
    icon: Clock,
    title: "Flexible Hours",
    description: "Open daily from 12 AM to 2 AM. Book your preferred time slot easily",
  },
  {
    icon: MapPin,
    title: "Great Location",
    description: "Located in the heart of downtown with easy access",
  },
];

export default function Home() {
  const { user } = useAuth();
  const navigation = useNavigation();

  return (
    <SafeAreaView className="flex-1 bg-slate-950" edges={["top"]}>
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>

        <View className="relative h-96 items-center justify-center overflow-hidden">
          <Image source={{ uri: HERO_IMAGE }} className="absolute inset-0 w-full h-full" resizeMode="cover" />
          <View className="absolute inset-0 bg-slate-950/80" />
          <View className="relative z-10 items-center px-6">
            <Text className="text-4xl font-bold text-center mb-3 text-blue-400">Welcome to PoolRoom</Text>
            <Text className="text-slate-300 text-center text-base mb-6 leading-relaxed">Experience the finest pool tables in town. Premium equipment, great atmosphere, unforgettable nights.</Text>
            <TouchableOpacity onPress={() => user ? navigation.navigate("Reserve") : navigation.navigate("login")} className="bg-purple-700 flex-row items-center gap-2 px-8 py-4 rounded-2xl">
              <Calendar size={20} color="#fff" />
              <Text className="text-white font-bold text-base">Book a Table</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View className="px-5 py-10">
          <Text className="text-3xl font-bold text-center text-blue-400 mb-2">Why Choose Pool Room?</Text>
          <Text className="text-slate-400 text-center mb-8">The best pool experience with premium tables and vibrant atmosphere.</Text>
          <View className="gap-4">
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <View key={i} className="bg-slate-900 border border-slate-800 rounded-2xl px-5 py-5">
                  <View className="flex-row items-center gap-3">
                    <View className="w-12 h-12 bg-purple-700 rounded-xl items-center justify-center">
                      <Icon size={22} color="#fff" />
                    </View>
                    <View className="flex-1">
                      <Text className="text-slate-100 text-lg font-bold">{f.title}</Text>
                      <Text className="text-slate-400 text-sm mt-1">{f.description}</Text>
                    </View>
                  </View>
                </View>
              );
            })}
          </View>
        </View>

        <View className="px-5 pb-10">
          <Text className="text-3xl font-bold text-center text-blue-400 mb-2">Our Tables</Text>
          <Text className="text-slate-400 text-center mb-8">Choose from our selection of premium pool tables</Text>
          <View className="gap-5">
            {tables.map((table) => (
              <View key={table.id} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
                <Image source={{ uri: table.image }} className="w-full h-44" resizeMode="cover" />
                <View className="px-5 pt-4 pb-5">
                  <Text className="text-slate-100 text-xl font-bold mb-1">{table.name}</Text>
                  <Text className="text-slate-400 text-sm mb-3">{table.description}</Text>
                  {table.features.map((feat, i) => (
                    <View key={i} className="flex-row items-center gap-2 mb-1">
                      <View className="w-2 h-2 rounded-full bg-purple-500" />
                      <Text className="text-slate-300 text-sm">{feat}</Text>
                    </View>
                  ))}
                </View>
              </View>
            ))}
          </View>
        </View>

        <View className="px-5 pb-10">
          <Text className="text-3xl font-bold text-center text-blue-400 mb-8">Visit Us</Text>
          <View className="bg-slate-900 border border-slate-800 rounded-2xl px-5 py-5 gap-5">
            {[
              { icon: MapPin, title: "Address", value: "N 5 მ. ნოზაძის ქუჩა, თბილისი", onPress: () => Linking.openURL("https://maps.google.com/?q=41.790796,44.818731") },
              { icon: Phone, title: "Phone", value: "+995 598 873 355", onPress: () => Linking.openURL("tel:+995598873355") },
              { icon: Mail, title: "Email", value: "poolroomofficialg@gmail.com", onPress: () => Linking.openURL("mailto:poolroomofficialg@gmail.com") },
              { icon: Clock, title: "Hours", value: "Mon–Sun 12:00 AM – 2:00 AM" },
            ].map(({ icon: Icon, title, value, onPress }, i) => (
              <TouchableOpacity key={i} onPress={onPress} disabled={!onPress} className="flex-row items-start gap-4">
                <View className="w-11 h-11 bg-purple-700 rounded-xl items-center justify-center">
                  <Icon size={20} color="#fff" />
                </View>
                <View className="flex-1">
                  <Text className="text-slate-100 font-semibold">{title}</Text>
                  <Text className="text-slate-400 text-sm mt-0.5">{value}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View className="px-5 pb-12">
          <View className="bg-purple-700 rounded-2xl p-8 items-center">
            <Text className="text-white text-2xl font-bold mb-2">Ready to Play?</Text>
            <Text className="text-purple-200 text-center text-sm mb-6">Book your table now and enjoy an unforgettable pool experience!</Text>
            <TouchableOpacity onPress={() => user ? navigation.navigate("Reserve") : navigation.navigate("login")} className="bg-white flex-row items-center gap-2 px-6 py-3 rounded-xl">
              <Calendar size={18} color="#7c3aed" />
              <Text className="text-purple-700 font-bold text-base">Book Your Table Now</Text>
            </TouchableOpacity>
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}