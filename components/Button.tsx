import { Pressable, Text, View } from "react-native";
import { forwardRef } from "react";

type ButtonProps = {
  text: string;
  className?: string;
} & React.ComponentPropsWithoutRef<typeof Pressable>;

const Button = forwardRef<View | null, ButtonProps>(
  ({ text, className, ...pressableProps }, ref) => {
    return (
      <Pressable
        ref={ref}
        {...pressableProps}
        className={`bg-[#2f95dc] items-center rounded-xl p-4 my-1.5 ${className}`}
      >
        <Text className="text-white text-xl font-semibold">{text}</Text>
      </Pressable>
    );
  },
);

export default Button;
