import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { AlertTriangle } from "lucide-react";

interface CancelReservationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  reservationDetails: {
    user: string;
    tableNumber: number;
    date: string;
    time: string;
  };
  loading?: boolean;
}

export default function CancelReservationModal({
  open,
  onOpenChange,
  onConfirm,
  reservationDetails,
  loading = false
}: CancelReservationModalProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="bg-slate-900 border-2 border-red-700/50 shadow-2xl shadow-red-500/20 max-w-md">
        <AlertDialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-full bg-red-900/30 border-2 border-red-700 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-400" />
            </div>
            <AlertDialogTitle className="text-2xl font-bold text-slate-100">
              Cancel Reservation?
            </AlertDialogTitle>
          </div>
          <AlertDialogDescription className="text-slate-300 text-base leading-relaxed">
            Are you sure you want to cancel this reservation? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>

        {/* Reservation Details Card */}
        <div className="my-4 p-4 bg-slate-800 border border-slate-700 rounded-lg space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-slate-400 text-sm">Name:</span>
            <span className="text-slate-100 font-semibold">{reservationDetails.user}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-400 text-sm">Table:</span>
            <span className="text-purple-400 font-bold">#{reservationDetails.tableNumber}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-400 text-sm">Date:</span>
            <span className="text-slate-100">{reservationDetails.date}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-400 text-sm">Time:</span>
            <span className="text-slate-100">{reservationDetails.time}</span>
          </div>
        </div>

        <AlertDialogFooter className="gap-2">
          <AlertDialogCancel 
            disabled={loading}
            className="bg-slate-800 text-slate-100 border-slate-700 hover:bg-slate-700 hover:text-slate-50"
          >
            Keep Reservation
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              onConfirm();
            }}
            disabled={loading}
            className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white border-0 shadow-lg hover:shadow-red-500/50 transition-all"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Cancelling...
              </span>
            ) : (
              'Yes, Cancel It'
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}