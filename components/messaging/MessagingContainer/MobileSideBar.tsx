import { Sheet, SheetContent } from '@/components/ui/sheet';
import { ConversationSidebar } from './ConversationSidebar';

interface MobileSideBarProps {
  showMobileSidebar: boolean;
  setShowMobileSidebar: (show: boolean) => void;
  unreadMessagesCount: { [key: string]: number };
}

export const MobileSideBar = ({
  showMobileSidebar,
  setShowMobileSidebar,
  unreadMessagesCount,
}: MobileSideBarProps) => {
  return (
    <Sheet open={showMobileSidebar} onOpenChange={setShowMobileSidebar}>
      <SheetContent side="left" className="p-0 w-[300px] sm:w-[350px]">
        <div className="p-3 border-b">
          <h2 className="font-semibold">Conversations</h2>
        </div>
        <ConversationSidebar unreadMessagesCount={unreadMessagesCount} />
      </SheetContent>
    </Sheet>
  );
};
