import { TextareaInput } from "./textarea-input";
import type { Meta, StoryObj } from "@storybook/react";

const meta = {
  component: TextareaInput,
  title: "Input/TextareaInput",
} satisfies Meta<typeof TextareaInput>;

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
  },
};
