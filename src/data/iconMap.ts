import BlueArrow from "../../assets/project/icons/blue_arrow.svg";
import GreenArrow from "../../assets/project/icons/green_arrow.svg";
import Medicine from "../../assets/project/icons/medicine.svg";
import StopIcon from "../../assets/project/icons/stop.svg";
import WcIcon from "../../assets/project/icons/wc.svg";

const iconMap: Record<string, React.ComponentType<any>> = {
  no_entry: StopIcon,
  guest_entry: GreenArrow,
  staff_entry: BlueArrow,
  medicine: Medicine,
  stop: StopIcon,
  wc: WcIcon,
};

export default iconMap;
