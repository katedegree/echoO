import { useState } from "react";
import { Modal } from "./modal";
import type { Meta, StoryObj } from "@storybook/react";

const meta = {
  component: Modal,
  title: "Form/Modal",
} satisfies Meta<typeof Modal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => {
    const [isOpen, setIsOpen] = useState(args.isOpen);
    return (
      <div className="text-label [&_button]:cursor-pointer">
        <button
          className="bg-flat py-md px-lg rounded-input"
          onClick={() => setIsOpen(!isOpen)}
        >
          Open Modal
        </button>
        <Modal {...args} isOpen={isOpen} onClose={() => setIsOpen(false)}>
          <div className="relative bg-flat rounded-input p-xl flex items-center justify-center min-w-[300px] min-h-[200px]">
            <h2 className="text-[24px]">Modal</h2>
            <button
              className="absolute top-lg right-lg"
              onClick={() => setIsOpen(false)}
            >
              Close
            </button>
          </div>
        </Modal>
      </div>
    );
  },
  args: {
    isOpen: false,
    onClose: () => {},
    children: null,
  },
};
