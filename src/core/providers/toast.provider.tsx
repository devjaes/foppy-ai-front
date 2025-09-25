"use client";

export default function ToastProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <section>{children}</section>;
}
