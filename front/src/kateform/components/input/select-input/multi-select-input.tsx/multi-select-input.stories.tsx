import type { Meta, StoryObj } from "@storybook/react";
import { MultiSelectInput } from "./multi-select-input";
import { useState } from "react";

const meta = {
  component: MultiSelectInput,
  title: "Input/SelectInput/MultiSelectInput",
} satisfies Meta<typeof MultiSelectInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => {
    const [value, setValue] = useState<number[]>([]);
    const options = [
      { value: 1, label: "運動" },
      { value: 2, label: "読書" },
      { value: 3, label: "映画鑑賞" },
      { value: 4, label: "ゲーム" },
      { value: 5, label: "料理" },
      { value: 6, label: "音楽" },
      { value: 7, label: "旅行" },
      { value: 8, label: "美術鑑賞" },
      { value: 9, label: "美容" },
      { value: 10, label: "美食" },
      { value: 11, label: "スポーツ" },
      { value: 12, label: "バイク" },
      { value: 13, label: "自転車" },
      { value: 14, label: "自動車" },
      { value: 15, label: "バス" },
      { value: 16, label: "電車" },
      { value: 17, label: "飛行機" },
      { value: 18, label: "ボート" },
      { value: 19, label: "タクシー" },
    ];
    return (
      <MultiSelectInput
        {...args}
        value={value}
        onChange={(v) => setValue(v)}
        options={options}
      />
    );
  },
  args: {
    label: "趣味",
    id: "hobbies",
    placeholder: "選択してください",
    isDisabled: false,
    isReadOnly: false,
    onReadOnly: () => console.log("readonly"),
  },
};
