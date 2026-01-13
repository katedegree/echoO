import type { Meta, StoryObj } from "@storybook/react";
import { PasswordInput } from "./password-input";

const meta = {
  component: PasswordInput,
  title: "Input/PasswordInput",
} satisfies Meta<typeof PasswordInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: "パスワード",
    id: "password",
    placeholder: "パスワードを入力してください",
    onChange: (e) => console.log(e),
    isDisabled: false,
    isReadOnly: false,
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
        stroke-linecap="round"
        stroke-linejoin="round"
        className="w-[24px] h-[24px]"
      >
        <circle cx="12" cy="16" r="1" />
        <rect x="3" y="10" width="18" height="12" rx="2" />
        <path d="M7 10V7a5 5 0 0 1 10 0v3" />
      </svg>
    ),
  },
};
