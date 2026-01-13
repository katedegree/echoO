import type { Meta, StoryObj } from "@storybook/react";
import { NumberInput } from "./number-input";
import { useState } from "react";

const meta = {
  component: NumberInput,
  title: "Input/NumberInput",
} satisfies Meta<typeof NumberInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => {
    const [value, setValue] = useState<number>();
    return (
      <NumberInput {...args} value={value} onChange={(v) => setValue(v)} />
    );
  },
  args: {
    label: "年齢",
    id: "age",
    placeholder: "年齢を入力してください。",
    onChange: (v) => console.log(v),
    onReadOnly: () => console.log("readonly"),
    endContent: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-[24px] h-[24px]"
      >
        <path d="M18 20a6 6 0 0 0-12 0" />
        <circle cx="12" cy="10" r="4" />
        <circle cx="12" cy="12" r="10" />
      </svg>
    ),
  },
};
