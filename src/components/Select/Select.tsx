"use client";

import * as React from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import * as ScrollArea from "@radix-ui/react-scroll-area";
import { Check, ChevronDown } from "lucide-react";
import "../styles.css";

import { useVirtualizer } from "@tanstack/react-virtual";

import { cn } from "../../lib/utils";

const Select = SelectPrimitive.Root;

const SelectGroup = SelectPrimitive.Group;

const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    className={cn(
      `flex h-8 w-full items-center justify-between rounded-lg border border-grey-300 bg-white px-3 py-2 ring-offset-grey-300 placeholder:text-grey 
      focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-20 focus:border-primary-active 
      disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-grey-100 [&>span]:line-clamp-1`,
      className
    )}
    {...props}
  >
    {children}
    <SelectPrimitive.Icon asChild>
      <ChevronDown className="h-4 w-4" color="#98A2B3" />
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
));
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName;

const SelectValue = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Value>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Value>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Value
    ref={ref}
    className={cn("text-grey-400 placeholder:text-grey-400", className)}
    {...props}
  />
));
SelectValue.displayName = SelectPrimitive.Value.displayName;

const SelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ className, children, position = "popper", ...props }, ref) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      ref={ref}
      className={cn(
        "relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-lg border bg-white text-text-default shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        position === "popper" &&
          "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
        position === "popper" &&
          "w-full min-w-[var(--radix-select-trigger-width)] overflow-y-auto max-h-96 zolastic-component-library-experiment-select-content",
        className
      )}
      position={position}
      {...props}
    >
      <ScrollArea.Root
        className="zolastic-component-library-experiment-select-scroll-area-root"
        type="auto"
      >
        <SelectPrimitive.Viewport className={cn("p-1")}>
          <ScrollArea.Viewport className="zolastic-component-library-experiment-select-scroll-area-viewport">
            {children}
          </ScrollArea.Viewport>
        </SelectPrimitive.Viewport>
        <ScrollArea.Scrollbar
          className="zolastic-component-library-experiment-select-scroll-area-scrollbar"
          orientation="vertical"
        >
          <ScrollArea.Thumb className="zolastic-component-library-experiment-select-scroll-area-thumb" />
        </ScrollArea.Scrollbar>
      </ScrollArea.Root>
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
));
SelectContent.displayName = SelectPrimitive.Content.displayName;

type VirtualizedSelectContentProps = React.ComponentPropsWithoutRef<
  typeof SelectPrimitive.Content
> & {
  height: React.CSSProperties["height"];
  items: { label: string; value: string }[];
  virtualizerOptions?: VirtualizerOptions;
};

const VirtualizedSelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  VirtualizedSelectContentProps
>(({ height, items, virtualizerOptions }, ref) => {
  const [filteredItems, setFilteredItems] = React.useState(items);
  const parentRef = React.useRef(null);

  // Virtualizer logic
  const _virtualizerOptions =
    virtualizerOptions === undefined
      ? {
          count: filteredItems.length,
          getScrollElement: () => parentRef.current,
          estimateSize: () => 35,
          overscan: 5,
        }
      : {
          ...virtualizerOptions,
          count: filteredItems.length,
          getScrollElement: () => parentRef.current,
        };
  const virtualizer = useVirtualizer(_virtualizerOptions);
  const virtualItems = virtualizer.getVirtualItems();

  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        className={cn(
          "relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-lg border bg-white text-text-default shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
          "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
          "w-full min-w-[var(--radix-select-trigger-width)] overflow-y-auto max-h-96 zolastic-component-library-experiment-select-content"
        )}
        position={"popper"}
      >
        <SelectPrimitive.Viewport className="SelectViewport">
          <SelectPrimitive.Group
            ref={parentRef}
            style={{
              height: height,
              width: "100%",
              overflow: "auto",
            }}
          >
            <div
              style={{
                height: `${virtualizer.getTotalSize()}px`,
                width: "100%",
                position: "relative",
              }}
            >
              {virtualItems.map((item) => (
                <SelectPrimitive.Item
                  key={filteredItems[item.index].value}
                  value={filteredItems[item.index].value}
                  className={cn(
                    "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-primary-accent focus:text-text-default data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                  )}
                >
                  <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                    <SelectPrimitive.ItemIndicator>
                      <Check className="h-4 w-4" color="#98A2B3" />
                    </SelectPrimitive.ItemIndicator>
                  </span>
                  <SelectPrimitive.ItemText>
                    {filteredItems[item.index].label}
                  </SelectPrimitive.ItemText>
                </SelectPrimitive.Item>
              ))}
            </div>
          </SelectPrimitive.Group>
        </SelectPrimitive.Viewport>
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  );
});
VirtualizedSelectContent.displayName = SelectContent.displayName;

type VirtualizedSelectProps = {
  items: { label: string; value: string }[];
  height?: React.CSSProperties["height"];
  placeholderText?: string;
  onSelect?: (value: string) => void;
  virtualizerOptions?: VirtualizerOptions;
};

type UseVirtualizerParam = Parameters<typeof useVirtualizer>[0];
// need to remove count and getScrollElement from VirtualizedComboboxVirtualizerOptions
export type VirtualizerOptions = Omit<
  UseVirtualizerParam,
  "count" | "getScrollElement"
>;

const VirtualizedSelect = ({
  height = "400px",
  items,
  placeholderText = "No item selected.",
  onSelect,
  virtualizerOptions,
}: VirtualizedSelectProps) => {
  return (
    <Select>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder={placeholderText} />
      </SelectTrigger>
      <VirtualizedSelectContent
        height={height}
        items={items}
        virtualizerOptions={virtualizerOptions}
      />
    </Select>
  );
};

const SelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-primary-accent focus:text-text-default data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <SelectPrimitive.ItemIndicator>
        <Check className="h-4 w-4" color="#98A2B3" />
      </SelectPrimitive.ItemIndicator>
    </span>

    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
));
SelectItem.displayName = SelectPrimitive.Item.displayName;

const SelectLabel = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Label
    ref={ref}
    className={cn("py-1.5 pl-8 pr-2 text-sm font-semibold", className)}
    {...props}
  />
));
SelectLabel.displayName = SelectPrimitive.Label.displayName;

const SelectSeparator = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Separator
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-muted", className)}
    {...props}
  />
));
SelectSeparator.displayName = SelectPrimitive.Separator.displayName;

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  VirtualizedSelectContent,
  VirtualizedSelect,
  SelectLabel,
  SelectItem,
  SelectSeparator,
};
