import { useState } from "react";
import { MediaInput } from "./media-input";
import type { Meta, StoryObj } from "@storybook/react";

const meta = {
  component: MediaInput,
  title: "Input/FileInput/MediaInput",
} satisfies Meta<typeof MediaInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => {
    const [url, setUrl] = useState<string | null>(null);
    const handleUpload = async (file: File) => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const baseUrl = URL.createObjectURL(file);
      const fragment = file.type.startsWith("image") ? "#.png" : "#.mp4";
      const url = baseUrl + fragment;
      setUrl(url);
    };
    const handleRemove = () => setUrl(null);
    return (
      <MediaInput
        {...args}
        url={url}
        onChange={{ upload: handleUpload, remove: handleRemove }}
      />
    );
  },
  args: {
    label: "ファイル",
    id: "media",
    placeholder: "ファイルを選択してください",
    isDisabled: false,
    isReadOnly: false,
    onReadOnly: () => console.log("readonly"),
  },
};
