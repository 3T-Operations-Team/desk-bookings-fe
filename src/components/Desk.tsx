import "../styles/Desk.css";
import store from "../store/store";
import { Bookings, selectDesk } from "../store/bookingsReducer";
import { useSelector } from "react-redux";
import { DeskObject } from "../types/desks";
import { useAllDateBookings } from "../services/queries";
import { useAuth } from "../auth";

export const deskWidth: number = 120;
export const deskHeight: number = 60;
export const chairHeight: number = 40;
export const chairOverlap: number = 7;

const getDeskClass = (
  selected: boolean,
  special: boolean,
  available: boolean,
  booked: boolean,
  disabled: boolean,
): string => {
  let className = "";
  if (selected && !booked) className += " selected";
  if (special) className += " special";
  if (available) className += " available";
  if (booked) className += " booked";
  if (disabled) className += " disabled";
  return className;
};

const Desk: React.FC<DeskObject> = ({
  id,
  name,
  selectable,
  rotation,
  adjustableDesk,
}) => {
  const { userEmail } = useAuth();

  const selectedDesk = useSelector((state: Bookings) => state.selectedDesk);
  const selectedDate = useSelector((state: Bookings) => state.selectedDate);

  const allDesksBooked = useAllDateBookings(selectedDate).data;

  const existingBooking =
    allDesksBooked?.find((desk) => desk.email === userEmail) !== undefined;
  const bookedByMe =
    allDesksBooked?.find(
      (desk) => desk.deskNumber === id && desk.email === userEmail,
    ) !== undefined;
  const isSelected = id === selectedDesk;
  const isBooked =
    allDesksBooked?.find(
      (desk) => desk.deskNumber === id && desk.email !== userEmail,
    ) !== undefined;
  const isAvailable = selectable && !isBooked;
  const disabled = existingBooking;

  const deskClass = getDeskClass(
    isSelected,
    adjustableDesk,
    isAvailable,
    bookedByMe,
    disabled,
  );

  const getTooltipText = (): string => {
    const tootipText: string[] = [];

    if (adjustableDesk) {
      tootipText.push("Adjustable desk");
    }

    if (!selectable) {
      tootipText.push("Desk not selectable");
    }

    if (isBooked) {
      tootipText.push("Already booked");
    }

    if (bookedByMe) {
      tootipText.push("Already booked by you");
    }

    return tootipText.join("\n");
  };

  return (
    <div
      className={"desk-container"}
      style={{
        transform: `rotate(${rotation}deg)`,
      }}
      title={getTooltipText()}
    >
      <div
        className={"desk" + deskClass}
        style={{
          top: `${chairHeight - chairOverlap}px`,
          width: `${deskWidth}px`,
          height: `${deskHeight}px`,
        }}
        onClick={() => {
          if (selectable && !isBooked && !existingBooking)
            store.dispatch(selectDesk({ selectedDesk: id }));
        }}
      >
        <label
          className={"desk-label" + deskClass}
          style={{
            transform: `rotate(-${rotation}deg)`,
          }}
        >
          {name}
        </label>
      </div>
      <img
        className={"chair"}
        src="chair.svg"
        width={deskWidth}
        height={chairHeight}
      />
    </div>
  );
};

export default Desk;
