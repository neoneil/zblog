"use client";

import { useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";
import { Bold, Italic, Heading2, List, ListOrdered, Link2, Quote, Eye, Pencil, Save, Upload } from "lucide-react";
import { usePreferences } from "@/components/site/preferences-provider";
import { createClient } from "@/lib/supabase/client";
import { Button, ButtonLink } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { saveCommunityProfile } from "@/app/community/actions";
import { signSlugs, type CommunityProfile } from "../lib/model";
import { MemberAvatar, useSignLabel } from "./member-card";
import styles from "./community.module.css";

export type CommunityUser = { id: string; email: string; name: string };

async function avatarImage(file: File) {
  if (!['image/jpeg', 'image/png', 'image/gif', 'image/webp'].includes(file.type) || file.size > 20 * 1024 * 1024) throw new Error("image");
  const bitmap = await createImageBitmap(file);
  try {
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = 512;
    const context = canvas.getContext("2d");
    if (!context) throw new Error("image");
    const side = Math.min(bitmap.width, bitmap.height);
    context.drawImage(bitmap, (bitmap.width - side) / 2, (bitmap.height - side) / 2, side, side, 0, 0, 512, 512);
    return await new Promise<Blob>((resolve, reject) => canvas.toBlob(blob => blob ? resolve(blob) : reject(new Error("image")), "image/jpeg", .88));
  } finally { bitmap.close(); }
}

export default function ProfileEditor({ user, profile, unavailable }: { user: CommunityUser | null; profile: CommunityProfile | null; unavailable: boolean }) {
  const { t } = usePreferences();
  const sign = useSignLabel();
  const router = useRouter();
  const textarea = useRef<HTMLTextAreaElement>(null);
  const fileInput = useRef<HTMLInputElement>(null);
  const [about, setAbout] = useState(profile?.about || "");
  const [avatar, setAvatar] = useState(profile?.avatar_url || "");
  const [name, setName] = useState(profile?.display_name || user?.name || "");
  const [preview, setPreview] = useState(false);
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<{ en: string; zh: string } | null>(null);

  const format = (before: string, after = "") => {
    const input = textarea.current;
    if (!input) return;
    const start = input.selectionStart, end = input.selectionEnd;
    const next = about.slice(0, start) + before + about.slice(start, end) + after + about.slice(end);
    if (next.length > 6000) return;
    setAbout(next);
    requestAnimationFrame(() => { input.focus(); input.setSelectionRange(start + before.length, end + before.length); });
  };

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy || uploading) return;
    const form = new FormData(event.currentTarget);
    const password = String(form.get("password") || "");
    if (password && password !== form.get("password_confirm")) {
      setMessage({ en: "The passwords do not match.", zh: "两次密码输入不一致。" }); return;
    }
    // Passwords are sent only to Supabase Auth, never to the community action/table.
    form.delete("password"); form.delete("password_confirm");
    setBusy(true); setMessage(null);
    try {
      const result = await saveCommunityProfile(form);
      if (result.status !== "ok") {
        setMessage(result.status === "taken" ? { en: "That username is already taken.", zh: "这个用户名已被使用。" } : result.status === "login" ? { en: "Please sign in again.", zh: "请重新登录。" } : result.status === "invalid" ? { en: "Check your username, sign, role and public information.", zh: "请检查用户名、星座、身份及公开资料。" } : { en: "Could not save. Check the community database setup and try again.", zh: "保存失败，请确认社区数据库 SQL 已执行后重试。" });
        return;
      }
      if (password) {
        const { error } = await createClient().auth.updateUser({ password });
        if (error) {
          setMessage({ en: "Profile saved, but the password was not changed. Sign in again and retry the password change.", zh: "资料已保存，但密码未更改。请重新登录后再修改密码。" });
          router.refresh(); return;
        }
        document.querySelectorAll<HTMLInputElement>('[data-community-password]').forEach(input => { input.value = ""; });
      }
      setMessage({ en: "Your profile has been saved.", zh: "个人资料已保存。" });
      router.refresh();
    } catch { setMessage({ en: "Could not save. Please try again.", zh: "保存失败，请稍后重试。" }); }
    finally { setBusy(false); }
  }

  return <details className={styles.editor}>
    <summary>{t({ en: "Edit your community profile", zh: "编辑我的社区资料" })}</summary>
    <div className={styles.editorBody}>
      {!user ? <>
        <p>{t({ en: "Sign in to create your community profile.", zh: "登录后即可填写社区资料。" })}</p>
        <ButtonLink href="/login?next=%2Fcommunity" variant="secondary">{t({ en: "Sign in", zh: "登录" })}</ButtonLink>
      </> : <form onSubmit={submit}>
        <h2 className={styles.sectionHeading}>{t({ en: "Profile", zh: "个人资料" })}</h2>
        <p className={styles.muted}>{t({ en: "Your email and password are private. Your name, username and the public information below appear only when you publish your profile.", zh: "邮箱和密码不会公开。姓名、用户名及下方公开资料仅在你选择公开个人资料后展示。" })}</p>
        <div className={styles.formGrid}>
          <label className={styles.field}><span>{t({ en: "Username", zh: "用户名" })}</span><Input name="username" required minLength={3} maxLength={32} pattern="[A-Za-z0-9_]{3,32}" autoComplete="username" defaultValue={profile?.username || ""} /><small>{t({ en: "3–32 letters, numbers or underscores. Public address: /community/username", zh: "3–32 位英文字母、数字或下划线，公开地址为 /community/用户名。" })}</small></label>
          <label className={styles.field}><span>{t({ en: "Email", zh: "邮箱" })}</span><Input value={user.email} type="email" readOnly autoComplete="email" /></label>
          <label className={styles.field}><span>{t({ en: "New password (optional)", zh: "新密码（可选）" })}</span><Input name="password" type="password" minLength={8} maxLength={128} autoComplete="new-password" data-community-password /></label>
          <label className={styles.field}><span>{t({ en: "Confirm new password", zh: "确认新密码" })}</span><Input name="password_confirm" type="password" minLength={8} maxLength={128} autoComplete="new-password" data-community-password /></label>
          <div className={styles.field}><span>{t({ en: "Photo", zh: "头像" })}</span><div className={styles.avatarEdit}>
            <MemberAvatar key={avatar} profile={{ display_name: name || "S", avatar_url: avatar }} />
            <Button type="button" variant="secondary" disabled={uploading || busy || unavailable} onClick={() => fileInput.current?.click()}><Upload size={16} />{t({ en: uploading ? "Uploading…" : "Change", zh: uploading ? "上传中…" : "更换" })}</Button>
          </div><small>{t({ en: "JPEG, PNG, GIF or WebP, up to 20 MB. Saved as a square 512px photo. Public profile photos are publicly accessible.", zh: "支持 JPEG、PNG、GIF、WebP，最大 20 MB。自动保存为 512px 方形头像，动态图使用静态帧。头像文件可公开访问。" })}</small>
          <input ref={fileInput} type="file" accept="image/jpeg,image/png,image/gif,image/webp" hidden onChange={async (event) => {
            const file = event.target.files?.[0]; event.target.value = "";
            if (!file || !user) return;
            setUploading(true); setMessage(null);
            try {
              const blob = await avatarImage(file);
              const client = createClient();
              const path = `${user.id}/${crypto.randomUUID()}.jpg`;
              const { error } = await client.storage.from("community-avatars").upload(path, blob, { contentType: "image/jpeg", upsert: false });
              if (error) throw error;
              setAvatar(client.storage.from("community-avatars").getPublicUrl(path).data.publicUrl);
            } catch { setMessage({ en: "Could not upload. Choose a supported image and check the community storage setup.", zh: "头像上传失败，请检查图片格式及社区 Storage 配置。" }); }
            finally { setUploading(false); }
          }} />
          <input name="avatar_url" type="hidden" value={avatar} /></div>
        </div>
        <div className={styles.publicInfo}>
          <h2>{t({ en: "Public Information", zh: "公开资料" })}</h2>
          <div className={styles.formGrid}>
            <label className={styles.field}><span>{t({ en: "Display name", zh: "显示名称" })}</span><Input name="display_name" required maxLength={80} value={name} onChange={e => setName(e.target.value)} /></label>
            <label className={styles.field}><span>{t({ en: "Zodiac sign", zh: "星座" })}</span><Select name="zodiac_sign" required defaultValue={profile?.zodiac_sign || ""}><option value="" disabled>{t({ en: "Select your sign", zh: "选择星座" })}</option>{signSlugs.map(slug => <option key={slug} value={slug}>{sign(slug)}</option>)}</Select></label>
            <fieldset className={styles.field}><legend>{t({ en: "Community role", zh: "社区身份" })}</legend>
              <label><input type="radio" name="member_type" value="reader" required defaultChecked={profile?.member_type === "reader"} /> {t({ en: "Reader — I offer astrology services", zh: "Readers：我提供占星服务" })}</label>
              <label><input type="radio" name="member_type" value="customer" required defaultChecked={profile?.member_type === "customer"} /> {t({ en: "Customer — I seek astrology guidance", zh: "Customers：我寻求占星咨询" })}</label>
            </fieldset>
            <label className={styles.field}><span>{t({ en: "Location (optional)", zh: "所在地（可选）" })}</span><Input name="location" maxLength={100} defaultValue={profile?.location || ""} /></label>
            <label className={styles.field}><span>{t({ en: "Website (optional)", zh: "个人网站（可选）" })}</span><Input name="website" type="url" pattern="https://.*" maxLength={300} placeholder="https://" defaultValue={profile?.website || ""} /></label>
          </div>
          <label className={styles.field} htmlFor="community-about"><span>{t({ en: "About", zh: "自我介绍" })}</span></label>
          <div className={styles.tabs} role="toolbar" aria-label={t({ en: "About formatting", zh: "自我介绍排版" })}>
            {[{ icon: Bold, en: "Bold", zh: "加粗", before: "**", after: "**" }, { icon: Italic, en: "Italic", zh: "斜体", before: "*", after: "*" }, { icon: Heading2, en: "Heading", zh: "标题", before: "\n## " }, { icon: List, en: "Bullet list", zh: "项目列表", before: "\n- " }, { icon: ListOrdered, en: "Numbered list", zh: "编号列表", before: "\n1. " }, { icon: Link2, en: "Link", zh: "链接", before: "[", after: "](https://)" }, { icon: Quote, en: "Quote", zh: "引用", before: "\n> " }].map(tool => <Button key={tool.en} type="button" variant="ghost" size="icon" disabled={preview} title={t(tool)} aria-label={t(tool)} onClick={() => format(tool.before, tool.after)}><tool.icon size={17} /></Button>)}
            <Button type="button" variant="ghost" size="icon" aria-pressed={preview} title={t({ en: preview ? "Edit" : "Preview", zh: preview ? "编辑" : "预览" })} aria-label={t({ en: preview ? "Edit" : "Preview", zh: preview ? "编辑" : "预览" })} onClick={() => setPreview(!preview)}>{preview ? <Pencil size={17} /> : <Eye size={17} />}</Button>
          </div>
          {preview && <div className={styles.about}><ReactMarkdown skipHtml>{about || t({ en: "No introduction yet.", zh: "尚未填写介绍。" })}</ReactMarkdown></div>}
          <Textarea id="community-about" ref={textarea} name="about" value={about} onChange={e => setAbout(e.target.value)} rows={8} maxLength={6000} hidden={preview} />
          <p className={styles.muted}>{about.length} / 6000</p>
          <label className={styles.check}><input name="is_public" type="checkbox" defaultChecked={profile?.is_public || false} /><span>{t({ en: "Publish my profile in the community directory. My public information and photo will be visible to visitors.", zh: "在社区目录公开我的资料。我同意向访客展示上述公开资料和头像。" })}</span></label>
          <Button type="submit" disabled={busy || uploading || unavailable}><Save size={17} />{t({ en: busy ? "Saving…" : "Save profile", zh: busy ? "保存中…" : "保存资料" })}</Button>
        </div>
      </form>}
      <p role="status" aria-live="polite">{message ? t(message) : ""}</p>
    </div>
  </details>;
}
