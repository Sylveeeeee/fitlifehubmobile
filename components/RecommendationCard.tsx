// RecommendationNotification.tsx
import React, { useEffect, useState } from "react";
import {
  Animated,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Dimensions,
} from "react-native";
import { useToast } from "@/components/ToastProvider"; // ปรับ path

interface Props {
  totals: {
    calories: number;
    burned: number;
  };
  targets: {
    calories: number;
  };
}

export default function RecommendationNotification({ totals, targets }: Props) {
  const { showToast } = useToast();
  const [modalVisible, setModalVisible] = useState(false);
  const [currentMessage, setCurrentMessage] = useState("");
  const [toastVisible, setToastVisible] = useState(false);
  const fadeAnim = new Animated.Value(0);

  useEffect(() => {
    const remaining = Math.round(targets.calories - (totals.calories - totals.burned));

    let message = "";
    let type: "success" | "error" = "success";

    if (remaining > 100) {
      message = `You still need ${remaining} kcal to reach your daily goal. Keep going! 💪`;
      type = "success";
    } else if (remaining >= -100 && remaining <= 100) {
      message = "Congrats! You've reached your daily goal 🎉";
      type = "success";
    } else {
      message = `You exceeded your daily goal by ${Math.abs(remaining)} kcal. Try to balance next meal! ⚖️`;
      type = "error";
    }

    setCurrentMessage(message);
    setToastVisible(true);

    // Animate Toast ลงมา
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();

    // Hide Toast หลัง 3 วินาที
    const timer = setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }).start(() => setToastVisible(false));
    }, 5000);

    // แสดงผ่าน ToastProvider ด้วย
    showToast(message, type);

    return () => clearTimeout(timer);
  }, [totals, targets]);

  if (!toastVisible) return null;

  return (
    <>
      {/* Toast เลื่อนลงมา และ Touchable */}
      <Animated.View
        style={[
          styles.toast,
          { opacity: fadeAnim },
        ]}
      >
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Text style={styles.text}>{currentMessage}</Text>
        </TouchableOpacity>
      </Animated.View>

      {/* Modal แสดงรายละเอียด */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <Animated.View style={styles.modalBackground}>
          <Animated.View style={styles.modalContainer}>
            <Text style={styles.modalText}>{currentMessage}</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeText}>Close</Text>
            </TouchableOpacity>
          </Animated.View>
        </Animated.View>
      </Modal>
    </>
  );
}

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  toast: {
    position: "absolute",
    top: 60,
    alignSelf: "center",
    backgroundColor: "#1565c0",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    maxWidth: width - 40,
    zIndex: 9999,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 10,
  },
  text: {
    color: "white",
    fontWeight: "600",
  },
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    maxWidth: "90%",
    alignItems: "center",
  },
  modalText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
  },
  closeButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: "#1565c0",
    borderRadius: 8,
  },
  closeText: {
    color: "white",
    fontWeight: "600",
  },
});
