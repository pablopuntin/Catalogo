type HeaderProps = {
  count: number;
  message: string;
};

export function Header({ count, message }: HeaderProps) {
  function handleWhatsApp() {
    const phone = "5493857408499";
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(
      message
    )}`;

    window.open(url, "_blank");
  }

  return (
    <header className="sticky top-0 bg-black border-b">
      <div className="flex items-center justify-between p-4">
        <button>☰</button>

        <h1 className="font-bold">Deportes Max</h1>

        <button onClick={handleWhatsApp} className="text-sm font-medium">
          🛒 {count}
        </button>
      </div>
    </header>
  );
}