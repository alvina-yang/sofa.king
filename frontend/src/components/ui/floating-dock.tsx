import { useRef, useState } from "react";
import { cn } from "@/lib/utils";
import {
  IconLayoutNavbarCollapse,
  IconHome2,
  IconWallet,
  IconCash,
  IconHelp,
  IconPlus,
} from "@tabler/icons-react";
import {
  AnimatePresence,
  MotionValue,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import Link from "next/link";

const links = [
  {
    title: "Home",
    icon: <IconHome2 className="h-full w-full text-zinc-200 dark:text-zinc-300" />,
    href: "/dashboard",
  },
  {
    title: "Accounts",
    icon: <IconWallet className="h-full w-full text-zinc-200 dark:text-zinc-300" />,
    href: "/accounts",
  },
  {
    title: "Budgets",
    icon: <IconCash className="h-full w-full text-zinc-200 dark:text-zinc-300" />,
    href: "/budgets",
  },
  {
    title: "Help",
    icon: <IconHelp className="h-full w-full text-zinc-200 dark:text-zinc-300" />,
    href: "/help",
  },
];

export const FloatingDock = ({
  desktopClassName,
  mobileClassName,
  onUpdateData,
}: {
  desktopClassName?: string;
  mobileClassName?: string;
  onUpdateData: () => void;
}) => {
  const [modalOpen, setModalOpen] = useState(false);

  const handleModalClose = () => {
    setModalOpen(false);
  };

  const handleAddTransaction = () => {
    setModalOpen(true);
  };

  return (
    <>
      <FloatingDockDesktop
        items={links}
        className={desktopClassName}
        onAddTransaction={handleAddTransaction}
      />
      <FloatingDockMobile
        items={links}
        className={mobileClassName}
        onAddTransaction={handleAddTransaction}
      />
      {modalOpen && (
        <TransactionModal
          isOpen={modalOpen}
          onClose={handleModalClose}
          onUpdateData={onUpdateData}
        />
      )}
    </>
  );
};

const FloatingDockMobile = ({
  items,
  className,
  onAddTransaction,
}: {
  items: { title: string; icon: React.ReactNode; href: string }[];
  className?: string;
  onAddTransaction: () => void;
}) => {
  const [open, setOpen] = useState(false);

  return (
    <div className={cn("fixed bottom-4 right-4 z-50 block md:hidden", className)}>
      <AnimatePresence>
        {open && (
          <motion.div className="absolute bottom-full mb-2 right-0 flex flex-col gap-2">
            {items.map((item) => (
              <motion.div key={item.title}>
                <Link href={item.href} className="h-10 w-10 rounded-full bg-zinc-700 flex items-center justify-center">
                  <div className="h-4 w-4">{item.icon}</div>
                </Link>
              </motion.div>
            ))}
            <button onClick={onAddTransaction} className="h-10 w-10 rounded-full bg-green-600 flex items-center justify-center">
              <IconPlus className="h-5 w-5 text-white" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
      <button onClick={() => setOpen(!open)} className="h-12 w-12 rounded-full bg-zinc-800 flex items-center justify-center">
        <IconLayoutNavbarCollapse className="h-6 w-6 text-zinc-200" />
      </button>
    </div>
  );
};

const FloatingDockDesktop = ({
  items,
  className,
  onAddTransaction,
}: {
  items: { title: string; icon: React.ReactNode; href: string }[];
  className?: string;
  onAddTransaction: () => void;
}) => {
  const mouseX = useMotionValue(Infinity);

  return (
    <motion.div
      onMouseMove={(e) => mouseX.set(e.clientX)}
      onMouseLeave={() => mouseX.set(Infinity)}
      className={cn(
        "fixed bottom-4 left-1/2 -translate-x-1/2 z-50 hidden md:flex h-16 gap-x-8 items-end rounded-2xl bg-zinc-800 px-4 pb-3",
        className
      )}
    >
      {items.map((item) => (
        <IconContainer mouseX={mouseX} key={item.title} {...item} />
      ))}
      <IconContainer
        mouseX={mouseX}
        title="Add Transaction"
        icon={<IconPlus className="text-white" />}
        href="#"
        onClick={onAddTransaction}
      />
    </motion.div>
  );
};

const TransactionModal = ({
  isOpen,
  onClose,
  onUpdateData,
}: {
  isOpen: boolean;
  onClose: () => void;
  onUpdateData: () => void;
}) => {
  const [formData, setFormData] = useState({
    merchant: "",
    amount: "",
    date: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (!formData.merchant || !formData.amount || !formData.date) {
      alert("All fields are required.");
      return;
    }
  
    setLoading(true);
  
    try {
      const payload = {
        merchant: formData.merchant,
        amount: parseFloat(formData.amount),
        date: formData.date,
      };
  
      const response = await fetch("http://localhost:5000/api/add-transaction", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
  
      await response.json();
      onUpdateData(); // Trigger data refresh
      onClose(); // Close modal
      setFormData({ merchant: "", amount: "", date: "" }); // Reset form
    } finally {
      setLoading(false);
    }
  };
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-80">
        <h2 className="text-xl font-bold mb-4">Add a Transaction</h2>
        <form onSubmit={handleSubmit}>
          {/* Merchant Field */}
          <div className="mb-4">
            <label htmlFor="merchant" className="block text-sm font-medium text-gray-700">
              Merchant
            </label>
            <input
              type="text"
              id="merchant"
              name="merchant"
              value={formData.merchant}
              onChange={handleChange}
              placeholder="Enter merchant"
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
            />
          </div>
          {/* Amount Field */}
          <div className="mb-4">
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
              Amount
            </label>
            <input
              type="number"
              id="amount"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              placeholder="Enter amount"
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
            />
          </div>
          {/* Date Field */}
          <div className="mb-4">
            <label htmlFor="date" className="block text-sm font-medium text-gray-700">
              Date
            </label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
            />
          </div>
          {/* Buttons */}
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="mr-2 px-4 py-2 text-sm bg-gray-300 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm bg-green-600 text-white rounded-lg"
              disabled={loading}
            >
              {loading ? "Adding..." : "Add"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

function IconContainer({
  mouseX,
  title,
  icon,
  href,
  onClick,
}: {
  mouseX: MotionValue;
  title: string;
  icon: React.ReactNode;
  href: string;
  onClick?: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const distance = useTransform(mouseX, (val) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });

  const width = useSpring(useTransform(distance, [-150, 0, 150], [40, 80, 40]), {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });

  const height = useSpring(useTransform(distance, [-150, 0, 150], [40, 80, 40]), {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });

  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      ref={ref}
      style={{ width, height }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
      className="aspect-square rounded-full bg-zinc-700 flex items-center justify-center relative cursor-pointer"
    >
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0, y: 10, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: 10, x: "-50%" }}
            className="px-2 py-0.5 whitespace-pre rounded-md bg-zinc-800 border border-zinc-600 text-zinc-200 absolute left-1/2 -translate-x-1/2 -top-8 w-fit text-xs"
          >
            {title}
          </motion.div>
        )}
      </AnimatePresence>
      <motion.div className="flex items-center justify-center">{icon}</motion.div>
    </motion.div>
  );
}

export default FloatingDock;
