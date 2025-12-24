import { useRef } from "react";
import { useDrag, useDrop } from "react-dnd";
import { IdeaCard, Idea } from "./IdeaCard";

interface DraggableIdeaCardProps {
  idea: Idea;
  index: number;
  onEdit: (idea: Idea) => void;
  onDelete: (id: string) => void;
  moveCard: (dragIndex: number, hoverIndex: number) => void;
}

const ItemType = "IDEA_CARD";

export function DraggableIdeaCard({
  idea,
  index,
  onEdit,
  onDelete,
  moveCard,
}: DraggableIdeaCardProps) {
  const ref = useRef<HTMLDivElement>(null);

  const [{ isDragging }, drag] = useDrag({
    type: ItemType,
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: ItemType,
    hover(item: { index: number }) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) {
        return;
      }

      moveCard(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  drag(drop(ref));

  return (
    <div ref={ref} style={{ opacity: isDragging ? 0.5 : 1 }}>
      <IdeaCard
        idea={idea}
        onEdit={onEdit}
        onDelete={onDelete}
        isDragging={isDragging}
      />
    </div>
  );
}
