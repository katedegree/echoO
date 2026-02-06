import { useState } from "react";
import { Drawer } from "./drawer";
import type { Meta, StoryObj } from "@storybook/react";
import { cn } from "@kateform/utils";

const meta = {
  component: Drawer,
  title: "Form/Drawer",
} satisfies Meta<typeof Drawer>;

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
          Open Drawer
        </button>
        <Drawer {...args} isOpen={isOpen} onClose={() => setIsOpen(false)}>
          <div
            className={cn(
              "relative bg-flat h-full flex items-center justify-center",
              args.placement === "top" && "h-[75vh] rounded-b-input",
              args.placement === "bottom" && "h-[75vh] rounded-t-input",
              args.placement === "left" && "w-[75vw] rounded-r-input",
              args.placement === "right" && "w-[75vw] rounded-l-input",
            )}
          >
            <h2 className="text-[24px]">Drawer</h2>
            <button
              className="absolute top-lg right-lg"
              onClick={() => setIsOpen(false)}
            >
              Close
            </button>
          </div>
        </Drawer>
      </div>
    );
  },
  args: {
    isOpen: false,
    children: null,
    placement: "left",
  },
};
