import React from 'react';
import { Text, TextProps } from 'react-native';
import { useThemeColors } from '../hooks/useThemeColors';

interface ThemedTextProps extends TextProps {
  type?: 'text' | 'placeholder' | 'error' | 'primary' | 'secondary';
}

export function ThemedText(props: ThemedTextProps) {
  const { style, type = 'text', ...otherProps } = props;
  const themeColors = useThemeColors();

  return (
    <Text
      style={[{ color: themeColors[type] }, style]}
      {...otherProps}
    />
  );
}
