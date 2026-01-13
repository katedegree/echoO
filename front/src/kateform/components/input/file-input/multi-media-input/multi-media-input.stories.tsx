import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { MultiMediaInput } from "./multi-media-input";

const meta = {
  component: MultiMediaInput,
  title: "Input/FileInput/MultiMediaInput",
} satisfies Meta<typeof MultiMediaInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => {
    const [urls, setUrls] = useState<string[]>([]);
    const handleUpload = async (file: File) => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const baseUrl = URL.createObjectURL(file);
      const fragment = file.type.startsWith("image") ? "#.png" : "#.mp4";
      const url = baseUrl + fragment;
      setUrls([url, ...urls]);
    };
    const handleRemove = (url: string) => {
      setUrls(urls.filter((u) => u !== url));
    };

    return (
      <MultiMediaInput
        {...args}
        urls={urls}
        onChange={{ upload: handleUpload, remove: handleRemove }}
      />
    );
  },
  args: {
    label: "ファイル",
    id: "medias",
    placeholder: "ファイルを選択してください",
    isDisabled: false,
    isReadOnly: false,
    onReadOnly: () => console.log("readonly"),
  },
};
