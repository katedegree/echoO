import type { Meta, StoryObj } from "@storybook/react";
import { SelectInput } from "./select-input";
import { useState } from "react";

const meta = {
  component: SelectInput,
  title: "Input/SelectInput/SelectInput",
} satisfies Meta<typeof SelectInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => {
    const [value, setValue] = useState<number | null>(null);
    const options = [
      { value: 1, label: "1月" },
      { value: 2, label: "2月" },
      { value: 3, label: "3月" },
      { value: 4, label: "4月" },
      { value: 5, label: "5月" },
      { value: 6, label: "6月" },
      { value: 7, label: "7月" },
      { value: 8, label: "8月" },
      { value: 9, label: "9月" },
      { value: 10, label: "10月" },
      { value: 11, label: "11月" },
      { value: 12, label: "12月" },
    ];
    return (
      <SelectInput
        {...args}
        value={value}
        onChange={(v) => setValue(v)}
        options={options}
      />
    );
  },
  args: {
    label: "誕生月",
    id: "birthMonth",
    placeholder: "選択してください",
    isDisabled: false,
    isReadOnly: false,
    onReadOnly: () => console.log("readonly"),
  },
};
