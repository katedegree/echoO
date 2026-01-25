import type { StoryObj } from "@storybook/react";
import { addKateFormToast } from "@kateform/utils";
import { useState } from "react";
import { useToastStore } from "@kateform/internal/stores";

const meta = {
  title: "Provider/ToastProvider",
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    const [count, setCount] = useState(0);
    const addToast = (type: "success" | "error", message: string) =>
      addKateFormToast(type, message);

    const { toasts } = useToastStore();
    return (
      <button
        className="bg-flat py-md px-lg rounded-input text-value cursor-pointer"
        onClick={() => {
          addToast("success", `Toast ${count}`);
          setCount(count + 1);
          console.log(toasts);
        }}
      >
        Show Toast
      </button>
    );
  },
};
