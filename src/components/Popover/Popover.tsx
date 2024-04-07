import React from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";

type Props = {};

const Popover = (props: Props) => {
  return (
    <PopoverPrimitive.Root>
      <PopoverPrimitive.Trigger>Trigger</PopoverPrimitive.Trigger>
      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content>Content</PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  );
};

export default Popover;
