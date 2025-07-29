import { Ionicons } from "@expo/vector-icons";
import React, { ReactNode, useEffect, useState } from "react";
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
  TextStyle,
  ColorValue,
  Platform,
} from "react-native";
import Modal from "react-native-modal";

const { width } = Dimensions.get("window");

// =============== TIPE DATA ===============
type AlertType = "success" | "error" | "warning" | "info";

type AlertButtonStyle = "default" | "cancel" | "destructive";

interface AlertButton {
  text: string;
  style?: AlertButtonStyle;
  onPress?: () => void;
}

interface AlertOptions {
  type?: AlertType;
  title?: string;
  message?: string;
  buttons?: AlertButton[];
  onDismiss?: () => void;
  timeout?: number;
}

interface AlertState extends AlertOptions {
  isVisible: boolean;
  autoCloseTimer?: NodeJS.Timeout;
}

interface AlertStyleConfig {
  iconName: keyof typeof Ionicons.glyphMap;
  iconColor: ColorValue;
  backgroundColor: ColorValue;
}

interface AlertProviderProps {
  children: ReactNode;
}

// =============== KONFIGURASI ALERT ===============
const ALERT_TYPES: Record<AlertType, AlertStyleConfig> = {
  success: {
    iconName: "checkmark-circle",
    iconColor: "#34C759",
    backgroundColor: "#E8F5E8",
  },
  error: {
    iconName: "close-circle",
    iconColor: "#FF3B30",
    backgroundColor: "#FFEBEE",
  },
  warning: {
    iconName: "warning",
    iconColor: "#FF9500",
    backgroundColor: "#FFF3E0",
  },
  info: {
    iconName: "information-circle",
    iconColor: "#007AFF",
    backgroundColor: "#E3F2FD",
  },
};

// =============== STATE GLOBAL ===============
let globalAlertState: AlertState = {
  isVisible: false,
  type: "info",
  title: "",
  message: "",
  buttons: [],
};

let alertUpdateCallback: React.Dispatch<React.SetStateAction<AlertState>> | null = null;

// =============== CUSTOM ALERT CLASS ===============
class CustomAlert {
  static show(options: AlertOptions) {
    // Clear existing timer if any
    if (globalAlertState.autoCloseTimer) {
      clearTimeout(globalAlertState.autoCloseTimer);
    }

    // Setup new timer if timeout provided
    let autoCloseTimer: NodeJS.Timeout | undefined;
    if (options.timeout) {
      autoCloseTimer = setTimeout(() => this.hide(), options.timeout);
    }

    globalAlertState = {
      ...options,
      isVisible: true,
      autoCloseTimer,
    };

    alertUpdateCallback?.(globalAlertState);
  }

  static hide() {
    // Clear existing timer
    if (globalAlertState.autoCloseTimer) {
      clearTimeout(globalAlertState.autoCloseTimer);
    }

    globalAlertState = {
      ...globalAlertState,
      isVisible: false,
      autoCloseTimer: undefined,
    };

    alertUpdateCallback?.(globalAlertState);
  }

  static success(title: string, message: string, buttons?: AlertButton[], timeout?: number) {
    this.show({ type: "success", title, message, buttons, timeout });
  }

  static error(title: string, message: string, buttons?: AlertButton[], timeout?: number) {
    this.show({ type: "error", title, message, buttons, timeout });
  }

  static warning(title: string, message: string, buttons?: AlertButton[], timeout?: number) {
    this.show({ type: "warning", title, message, buttons, timeout });
  }

  static info(title: string, message: string, buttons?: AlertButton[], timeout?: number) {
    this.show({ type: "info", title, message, buttons, timeout });
  }

  static alert(title: string, message: string, buttons: AlertButton[] = [{ text: "OK" }]) {
    this.show({ type: "info", title, message, buttons });
  }
}

// =============== ALERT PROVIDER COMPONENT ===============
const AlertProvider = ({ children }: AlertProviderProps) => {
  const [alertState, setAlertState] = useState<AlertState>(globalAlertState);

  useEffect(() => {
    alertUpdateCallback = setAlertState;
    return () => {
      alertUpdateCallback = null;
    };
  }, []);

  const handleButtonPress = (button: AlertButton) => {
    // Clear auto-close timer if any
    if (alertState.autoCloseTimer) {
      clearTimeout(alertState.autoCloseTimer);
    }

    button.onPress?.();
    CustomAlert.hide();
  };

  const handleModalHide = () => {
    alertState.onDismiss?.();
  };

  const alertType = alertState.type || "info";
  const alertConfig = ALERT_TYPES[alertType];

  // Perbaikan utama: Gunakan animasi yang lebih smooth
  return (
    <>
      {children}
      <Modal
        isVisible={alertState.isVisible}
        animationIn="slideInUp"
        animationOut="slideOutDown"
        animationInTiming={400} // Lebih cepat
        animationOutTiming={350} // Lebih cepat
        backdropOpacity={0.5}
        backdropTransitionInTiming={400}
        backdropTransitionOutTiming={300}
        onBackdropPress={CustomAlert.hide}
        onModalHide={handleModalHide}
        useNativeDriver={true}
        hideModalContentWhileAnimating={true}
        avoidKeyboard={true}
        statusBarTranslucent={true}
        style={styles.modal}>
        <View style={styles.alertContainer}>
          {/* Modal Header with Grey Line */}
          <View style={styles.modalHeader}>
            <View style={styles.greyLine} />
          </View>

          {/* Icon Section */}
          <View style={[styles.iconContainer, { backgroundColor: alertConfig.backgroundColor }]}>
            <Ionicons name={alertConfig.iconName} size={48} color={alertConfig.iconColor} />
          </View>

          {/* Content Section */}
          <View style={styles.contentContainer}>
            {alertState.title && <Text style={styles.titleText}>{alertState.title}</Text>}

            {alertState.message && <Text style={styles.messageText}>{alertState.message}</Text>}
          </View>

          {/* Buttons Section */}
          <View style={styles.buttonsContainer}>
            {alertState.buttons?.map((button, index) => {
              const isDestructive = button.style === "destructive";
              const isCancel = button.style === "cancel";
              const isPrimary = !isDestructive && !isCancel;

              return (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.button,
                    isDestructive && styles.destructiveButton,
                    isCancel && styles.cancelButton,
                    isPrimary && styles.primaryButton,
                    alertState.buttons?.length === 1 && styles.singleButton,
                  ]}
                  onPress={() => handleButtonPress(button)}
                  activeOpacity={0.7}>
                  <Text
                    style={[
                      styles.buttonText,
                      isDestructive && styles.destructiveButtonText,
                      isCancel && styles.cancelButtonText,
                      isPrimary && styles.primaryButtonText,
                    ]}>
                    {button.text}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </Modal>
    </>
  );
};

// =============== STYLES DIPERBAIKI ===============
interface Styles {
  modal: ViewStyle;
  alertContainer: ViewStyle;
  modalHeader: ViewStyle;
  greyLine: ViewStyle;
  iconContainer: ViewStyle;
  contentContainer: ViewStyle;
  titleText: TextStyle;
  messageText: TextStyle;
  buttonsContainer: ViewStyle;
  button: ViewStyle;
  singleButton: ViewStyle;
  primaryButton: ViewStyle;
  cancelButton: ViewStyle;
  destructiveButton: ViewStyle;
  buttonText: TextStyle;
  primaryButtonText: TextStyle;
  cancelButtonText: TextStyle;
  destructiveButtonText: TextStyle;
}

const styles = StyleSheet.create<Styles>({
  modal: {
    justifyContent: "flex-end",
    margin: 0,
    // Perbaikan: Hilangkan margin samping
    marginHorizontal: 0,
  },
  alertContainer: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingBottom: 34,
    minHeight: 200,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 }, // Diperbaiki
    shadowOpacity: 0.1,
    shadowRadius: 6, // Diperbaiki
    elevation: 6, // Diperbaiki
    width: "100%", // Pastikan lebar penuh
    // Solusi utama: Gunakan overflow hidden untuk menghindari flickering
    overflow: "hidden",
    // Solusi alternatif untuk Android
    ...Platform.select({
      android: {
        borderTopWidth: 1,
        borderTopColor: "#f0f0f0",
      },
    }),
  },
  modalHeader: {
    paddingTop: 12,
    paddingBottom: 20,
    width: "100%",
    alignItems: "center",
    // Perbaikan: Tambahkan overflow hidden
    overflow: "hidden",
  },
  greyLine: {
    height: 4,
    width: 40,
    backgroundColor: "#E0E0E0",
    borderRadius: 2,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    // Perbaikan: Tambahkan overflow hidden
    overflow: "hidden",
  },
  contentContainer: {
    alignItems: "center",
    marginBottom: 32,
    paddingHorizontal: 16,
    width: "100%", // Pastikan lebar penuh
  },
  titleText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#1C1C1E",
    textAlign: "center",
    marginBottom: 8,
    lineHeight: 28,
    width: "100%", // Pastikan lebar penuh
  },
  messageText: {
    fontSize: 16,
    color: "#8E8E93",
    textAlign: "center",
    lineHeight: 22,
    width: "100%", // Pastikan lebar penuh
  },
  buttonsContainer: {
    flexDirection: "row",
    width: "100%",
    gap: 12,
    paddingHorizontal: 4,
  },
  button: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 52,
  },
  singleButton: {
    flex: 1,
  },
  primaryButton: {
    backgroundColor: "#007AFF",
  },
  cancelButton: {
    backgroundColor: "#F2F2F7",
  },
  destructiveButton: {
    backgroundColor: "#FF3B30",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  primaryButtonText: {
    color: "#fff",
  },
  cancelButtonText: {
    color: "#8E8E93",
  },
  destructiveButtonText: {
    color: "#fff",
  },
});

export { AlertProvider, CustomAlert };
export default CustomAlert;
