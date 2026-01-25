import { TextInput } from "./text-input";
import type { Meta, StoryObj } from "@storybook/react";

const meta = {
  component: TextInput,
  title: "Input/TextInput",
} satisfies Meta<typeof TextInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: "名前",
    id: "name",
    placeholder: "名前を入力してください",
    onChange: (e) => console.log(e),
    isDisabled: false,
    isReadOnly: false,
    onReadOnly: () => console.log("readonly"),
    startContent: (
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
        <path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7" />
        <rect x="2" y="4" width="20" height="16" rx="2" />
      </svg>
    ),
  },
};
