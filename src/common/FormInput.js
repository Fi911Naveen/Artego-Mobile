export const FormInput = ({
    iconName,
    iconColor,
    returnKeyType,
    keyboardType,
    name,
    placeholder,
    ...rest
  }) => (
    <View style={styles.inputContainer}>
      <Input
        {...rest}
        leftIcon={<Ionicons name={iconName} size={28} color={iconColor} />}
        leftIconContainerStyle={styles.iconStyle}
        placeholderTextColor='grey'
        name={name}
        placeholder={placeholder}
        style={styles.input}
      />
    </View>
  )