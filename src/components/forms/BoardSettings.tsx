'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

import { AlertDialog } from '@/components/ui/alert-dialog';
import BoardDetails from '@/components/forms/BoardDetails';
import { IBoard } from '@/database/models/board.model';

const BoardSettings = ({
  boardId,
  boards,
}: {
  boardId: string;
  boards: IBoard[];
}) => {
  const router = useRouter();

  return (
    <AlertDialog>
      <div>
        <BoardDetails
          boardId={boardId}
          defaultData={boards.find((b) => b._id === boardId)}
        />
      </div>
    </AlertDialog>
  );
};

export default BoardSettings;
