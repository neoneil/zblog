"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type DeletePostButtonProps = {
  postId: string;
  postTitle: string;
};

export default function DeletePostButton({
  postId,
  postTitle,
}: DeletePostButtonProps) {
  const supabase = createClient();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleDelete() {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${postTitle}"?`
    );

    if (!confirmed) return;

    setLoading(true);
    setMessage("");

    const { error } = await supabase.from("posts").delete().eq("id", postId);

    if (error) {
      setMessage(error.message);
      setLoading(false);
      return;
    }

    router.refresh();
  }

  return (
    <div className="flex flex-col items-end gap-2">
      <button
        type="button"
        onClick={handleDelete}
        disabled={loading}
        className="rounded border px-3 py-2 text-sm"
      >
        {loading ? "Deleting..." : "Delete"}
      </button>

      {message ? <p className="text-sm text-red-600">{message}</p> : null}
    </div>
  );
}