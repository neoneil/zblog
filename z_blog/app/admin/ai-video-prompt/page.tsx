"use client";

import { useMemo, useState } from "react";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

type PromptKey = "shotSize" | "character" | "action" | "cameraMovement" | "facialExpression" | "lighting" | "style";

type PromptOption = {
  zh: string;
  en: string;
};

type PromptConfigItem = {
  label: string;
  key: PromptKey;
  options: PromptOption[];
};

const CUSTOM_VALUE = "__custom__";

const promptConfig: PromptConfigItem[] = [
  {
    label: "景别 Shot Size",
    key: "shotSize",
    options: [
      { zh: "极端特写", en: "Extreme Close Up" },
      { zh: "大特写", en: "Big Close Up" },
      { zh: "特写", en: "Close Up" },
      { zh: "中近景", en: "Medium Close Up" },
      { zh: "中景", en: "Medium Shot" },
      { zh: "美式中景", en: "Cowboy Shot" },
      { zh: "中远景", en: "Medium Long Shot" },
      { zh: "全景", en: "Full Shot" },
      { zh: "远景", en: "Wide Shot" },
      { zh: "超远景", en: "Extreme Wide Shot" },
      { zh: "建立镜头", en: "Establishing Shot" },
      { zh: "过肩镜头", en: "Over-the-Shoulder Shot" },
      { zh: "主观视角镜头", en: "Point of View Shot" },
      { zh: "俯拍镜头", en: "High Angle Shot" },
      { zh: "仰拍镜头", en: "Low Angle Shot" },
      { zh: "鸟瞰镜头", en: "Bird's Eye View Shot" },
      { zh: "荷兰倾斜镜头", en: "Dutch Angle Shot" },
    ],
  },
  {
    label: "人物 Character",
    key: "character",
    options: [
      { zh: "一位年轻的亚洲女学生", en: "a young Asian female student" },
      { zh: "一位女英语老师", en: "a female English teacher" },
      { zh: "一位十几岁的男学生", en: "a teenage boy student" },
      { zh: "一群学生", en: "a group of students" },
      { zh: "一个可爱的动画女孩", en: "a cute animated girl" },
      { zh: "一位真实感的办公室职员", en: "a realistic office worker" },
      { zh: "一位认真备考的 PTE 学生", en: "a focused PTE test taker" },
      { zh: "一位戴耳机学习的女生", en: "a female student wearing headphones" },
      { zh: "一位坐在电脑前的在线学生", en: "an online student sitting in front of a computer" },
      { zh: "一位在教室里讲课的老师", en: "a teacher presenting in a classroom" },
      { zh: "一位拿着平板学习的学生", en: "a student studying with a tablet" },
      { zh: "一个 3D 卡通女生角色", en: "a 3D cartoon female character" },
      { zh: "一个二次元风格学生角色", en: "an anime-style student character" },
      { zh: "一个温柔亲和的虚拟老师", en: "a warm and friendly virtual teacher" },
      { zh: "一个未来感 AI 学习助手", en: "a futuristic AI learning assistant" },
    ],
  },
  {
    label: "动作 Action",
    key: "action",
    options: [
      { zh: "认真听一句英文句子", en: "listens carefully to an English sentence" },
      { zh: "快速在笔记本上书写", en: "writes quickly in a notebook" },
      { zh: "轻声重复这个句子", en: "repeats the sentence softly" },
      { zh: "专注地背诵这个句子", en: "memorizes the sentence with focus" },
      { zh: "兴奋地看着屏幕", en: "looks at the screen with excitement" },
      { zh: "答对后开心庆祝", en: "celebrates after answering correctly" },
      { zh: "戴着耳机认真练习听力", en: "practices listening carefully with headphones" },
      { zh: "在屏幕上选择正确答案", en: "selects the correct answer on the screen" },
      { zh: "跟读英文句子并做笔记", en: "shadows an English sentence while taking notes" },
      { zh: "点击播放按钮听音频", en: "clicks the play button to listen to audio" },
      { zh: "在白板前讲解句子结构", en: "explains sentence structure in front of a whiteboard" },
      { zh: "在平板上查看学习进度", en: "checks learning progress on a tablet" },
      { zh: "皱眉思考一个难题", en: "thinks deeply about a difficult question" },
      { zh: "突然明白答案并露出笑容", en: "suddenly understands the answer and smiles" },
      { zh: "把重点单词高亮标记", en: "highlights key vocabulary words" },
      { zh: "在倒计时压力下完成题目", en: "completes the task under countdown pressure" },
      { zh: "看着分数提升后开心鼓掌", en: "claps happily after seeing an improved score" },
      { zh: "对着麦克风练习口语", en: "practices speaking into a microphone" },
      { zh: "在课堂中举手回答问题", en: "raises a hand to answer a question in class" },
      { zh: "跟随 AI 老师一步步学习", en: "follows an AI teacher step by step" },
    ],
  },
  {
    label: "摄影机运动 Camera Movement",
    key: "cameraMovement",
    options: [
      { zh: "固定镜头", en: "static camera" },
      { zh: "缓慢推近", en: "slow dolly in" },
      { zh: "向后拉远", en: "dolly out" },
      { zh: "快速推近", en: "fast push in" },
      { zh: "缓慢变焦推进", en: "slow zoom in" },
      { zh: "缓慢变焦拉远", en: "slow zoom out" },
      { zh: "向左摇镜", en: "pan left" },
      { zh: "向右摇镜", en: "pan right" },
      { zh: "快速甩镜", en: "whip pan" },
      { zh: "向上倾斜镜头", en: "tilt up" },
      { zh: "向下倾斜镜头", en: "tilt down" },
      { zh: "跟拍镜头", en: "tracking shot" },
      { zh: "侧向跟拍", en: "side tracking shot" },
      { zh: "手持摄影", en: "handheld camera" },
      { zh: "轻微手持晃动", en: "subtle handheld shake" },
      { zh: "稳定器跟拍", en: "gimbal tracking shot" },
      { zh: "环绕镜头", en: "orbit shot" },
      { zh: "半圆环绕镜头", en: "semi-circular orbit shot" },
      { zh: "升降镜头", en: "pedestal camera movement" },
      { zh: "吊臂上升镜头", en: "crane up shot" },
      { zh: "吊臂下降镜头", en: "crane down shot" },
      { zh: "无人机推进镜头", en: "drone push-in shot" },
      { zh: "无人机俯冲镜头", en: "drone descending shot" },
      { zh: "滑轨横移镜头", en: "slider lateral movement" },
      { zh: "焦点转移", en: "rack focus" },
      { zh: "慢动作镜头", en: "slow motion shot" },
      { zh: "时间流逝镜头", en: "time-lapse shot" },
      { zh: "第一人称视角移动", en: "first-person POV movement" },
      { zh: "电影感平滑运镜", en: "smooth cinematic camera movement" },
    ],
  },
  {
    label: "表情 Facial Expression",
    key: "facialExpression",
    options: [
      { zh: "专注的表情", en: "focused expression" },
      { zh: "自信的微笑", en: "confident smile" },
      { zh: "兴奋的表情", en: "excited expression" },
      { zh: "惊讶的表情", en: "surprised face" },
      { zh: "如释重负的微笑", en: "relieved smile" },
      { zh: "自豪的表情", en: "proud expression" },
      { zh: "紧张但坚定", en: "nervous but determined" },
      { zh: "认真思考", en: "thoughtful expression" },
      { zh: "轻微皱眉", en: "slightly furrowed brows" },
      { zh: "困惑的表情", en: "confused expression" },
      { zh: "恍然大悟的表情", en: "sudden realization expression" },
      { zh: "温柔的微笑", en: "gentle smile" },
      { zh: "鼓励式微笑", en: "encouraging smile" },
      { zh: "满意的微笑", en: "satisfied smile" },
      { zh: "开心大笑", en: "joyful laugh" },
      { zh: "期待的眼神", en: "anticipating look" },
      { zh: "坚定的眼神", en: "determined gaze" },
      { zh: "充满好奇的表情", en: "curious expression" },
      { zh: "被启发的表情", en: "inspired expression" },
      { zh: "轻松愉快的表情", en: "relaxed and cheerful expression" },
      { zh: "考试压力下的紧张表情", en: "anxious exam-pressure expression" },
      { zh: "努力回忆的表情", en: "trying-to-remember expression" },
      { zh: "听懂后的惊喜表情", en: "pleasantly surprised after understanding" },
      { zh: "充满成就感的表情", en: "sense-of-achievement expression" },
      { zh: "认真倾听的眼神", en: "attentive listening gaze" },
      { zh: "眨眼微笑", en: "smiling with a blink" },
      { zh: "眼睛发亮的开心表情", en: "bright-eyed happy expression" },
      { zh: "松了一口气的表情", en: "breathing-a-sigh-of-relief expression" },
      { zh: "冷静自信的表情", en: "calm and confident expression" },
      { zh: "可爱夸张的动画表情", en: "cute exaggerated animated expression" },
    ],
  },
  {
    label: "灯光 Lighting",
    key: "lighting",
    options: [
      { zh: "温暖的电影感灯光", en: "warm cinematic lighting" },
      { zh: "柔和的自然光", en: "soft natural light" },
      { zh: "黄金时刻光线", en: "golden hour lighting" },
      { zh: "明亮的教室灯光", en: "bright classroom lighting" },
      { zh: "戏剧性的逆光", en: "dramatic backlight" },
      { zh: "柔和的影棚灯光", en: "soft studio lighting" },
      { zh: "体积光", en: "volumetric light" },
      { zh: "柔和散射光", en: "soft diffused lighting" },
      { zh: "高调灯光", en: "high-key lighting" },
      { zh: "低调灯光", en: "low-key lighting" },
      { zh: "伦勃朗光", en: "Rembrandt lighting" },
      { zh: "蝴蝶光", en: "butterfly lighting" },
      { zh: "轮廓光", en: "rim lighting" },
      { zh: "边缘高光", en: "edge lighting" },
      { zh: "霓虹灯光", en: "neon lighting" },
      { zh: "赛博朋克霓虹光", en: "cyberpunk neon lighting" },
      { zh: "蓝粉渐变灯光", en: "blue and pink gradient lighting" },
      { zh: "柔和粉彩灯光", en: "soft pastel lighting" },
      { zh: "清晨窗边光", en: "morning window light" },
      { zh: "午后阳光", en: "afternoon sunlight" },
      { zh: "冷色调科技光", en: "cool futuristic lighting" },
      { zh: "暖色调室内光", en: "warm indoor lighting" },
      { zh: "梦幻发光效果", en: "dreamy glowing light" },
      { zh: "电影级三点布光", en: "cinematic three-point lighting" },
      { zh: "聚光灯效果", en: "spotlight effect" },
      { zh: "屏幕反射光", en: "screen glow lighting" },
      { zh: "柔和环形灯光", en: "soft ring light" },
      { zh: "明暗对比强烈的光影", en: "chiaroscuro lighting" },
      { zh: "动画电影柔光", en: "animated film soft lighting" },
    ],
  },
  {
    label: "风格 Style",
    key: "style",
    options: [
      { zh: "电影感", en: "cinematic" },
      { zh: "照片级真实感", en: "photorealistic" },
      { zh: "3D 动画风格", en: "3D animated style" },
      { zh: "动漫风格", en: "anime style" },
      { zh: "皮克斯类似风格", en: "Pixar-like style" },
      { zh: "教育视频风格", en: "educational video style" },
      { zh: "柔和粉彩动画", en: "soft pastel animation" },
      { zh: "迪士尼式 3D 动画", en: "Disney-like 3D animation style" },
      { zh: "梦工厂式动画风格", en: "DreamWorks-like animation style" },
      { zh: "日系校园动画风格", en: "Japanese school anime style" },
      { zh: "赛璐璐动画风格", en: "cel animation style" },
      { zh: "赛璐璐阴影风格", en: "cel-shaded style" },
      { zh: "黏土动画风格", en: "claymation style" },
      { zh: "定格动画风格", en: "stop-motion animation style" },
      { zh: "低多边形 3D 风格", en: "low-poly 3D style" },
      { zh: "等距插画风格", en: "isometric illustration style" },
      { zh: "扁平插画风格", en: "flat illustration style" },
      { zh: "儿童绘本风格", en: "children's storybook illustration style" },
      { zh: "水彩动画风格", en: "watercolor animation style" },
      { zh: "手绘动画风格", en: "hand-drawn animation style" },
      { zh: "铅笔素描动画", en: "pencil sketch animation" },
      { zh: "剪纸动画风格", en: "paper cutout animation style" },
      { zh: "极简现代风格", en: "minimal modern style" },
      { zh: "未来科技风格", en: "futuristic tech style" },
      { zh: "赛博朋克风格", en: "cyberpunk style" },
      { zh: "玻璃拟态风格", en: "glassmorphism style" },
      { zh: "可爱 Q 版风格", en: "cute chibi style" },
      { zh: "二次元少女风格", en: "anime girl aesthetic" },
      { zh: "清新校园风格", en: "fresh school campus style" },
      { zh: "温暖治愈系风格", en: "warm healing aesthetic" },
      { zh: "短视频广告风格", en: "short-form commercial video style" },
      { zh: "YouTube 教育频道风格", en: "YouTube educational channel style" },
      { zh: "AI 虚拟教师风格", en: "AI virtual teacher style" },
      { zh: "高端课程宣传片风格", en: "premium course promo style" },
      { zh: "电影预告片风格", en: "movie trailer style" },
    ],
  },
];

const initialValues: Record<PromptKey, PromptOption> = {
  shotSize: { zh: "中近景", en: "Medium Close Up" },
  character: { zh: "一位年轻的亚洲女学生", en: "a young Asian female student" },
  action: { zh: "认真听一句英文句子", en: "listens carefully to an English sentence" },
  cameraMovement: { zh: "缓慢推近", en: "slow dolly in" },
  facialExpression: { zh: "自信的微笑", en: "confident smile" },
  lighting: { zh: "温暖的电影感灯光", en: "warm cinematic lighting" },
  style: { zh: "电影感", en: "cinematic" },
};

const initialCustomMode: Record<PromptKey, boolean> = {
  shotSize: false,
  character: false,
  action: false,
  cameraMovement: false,
  facialExpression: false,
  lighting: false,
  style: false,
};

export default function AIVideoPromptPage() {
  const [values, setValues] = useState<Record<PromptKey, PromptOption>>(initialValues);
  const [customMode, setCustomMode] = useState<Record<PromptKey, boolean>>(initialCustomMode);

  const zhValues = useMemo(() => {
    return Object.fromEntries(Object.entries(values).map(([key, value]) => [key, value.zh])) as Record<PromptKey, string>;
  }, [values]);

  const enValues = useMemo(() => {
    return Object.fromEntries(Object.entries(values).map(([key, value]) => [key, value.en])) as Record<PromptKey, string>;
  }, [values]);

  const zhJsonOutput = useMemo(() => {
    return JSON.stringify(zhValues, null, 2);
  }, [zhValues]);

  const enJsonOutput = useMemo(() => {
    return JSON.stringify(enValues, null, 2);
  }, [enValues]);

  const zhPromptOutput = useMemo(() => {
    return `${values.shotSize.zh}，${values.character.zh}，${values.action.zh}，${values.cameraMovement.zh}，${values.facialExpression.zh}，${values.lighting.zh}，${values.style.zh}。`;
  }, [values]);

  const enPromptOutput = useMemo(() => {
    return `${values.shotSize.en}, ${values.character.en}, ${values.action.en}, ${values.cameraMovement.en}, ${values.facialExpression.en}, ${values.lighting.en}, ${values.style.en}.`;
  }, [values]);

  const updateValue = (key: PromptKey, value: string) => {
    if (value === CUSTOM_VALUE) {
      setCustomMode((prev) => ({ ...prev, [key]: true }));
      setValues((prev) => ({ ...prev, [key]: { zh: "", en: "" } }));
      return;
    }

    const configItem = promptConfig.find((item) => item.key === key);
    const selectedOption = configItem?.options.find((option) => option.en === value);

    if (!selectedOption) {
      return;
    }

    setCustomMode((prev) => ({ ...prev, [key]: false }));
    setValues((prev) => ({ ...prev, [key]: selectedOption }));
  };

  const updateCustomValue = (key: PromptKey, language: "zh" | "en", value: string) => {
    setValues((prev) => ({ ...prev, [key]: { ...prev[key], [language]: value } }));
  };

  const resetValues = () => {
    setValues(initialValues);
    setCustomMode(initialCustomMode);
  };

  const copyZhPrompt = async () => {
    await navigator.clipboard.writeText(zhPromptOutput);
  };

  const copyEnPrompt = async () => {
    await navigator.clipboard.writeText(enPromptOutput);
  };

  const copyZhJson = async () => {
    await navigator.clipboard.writeText(zhJsonOutput);
  };

  const copyEnJson = async () => {
    await navigator.clipboard.writeText(enJsonOutput);
  };

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 p-6">
      <div className="flex flex-col gap-3">
        <Badge className="w-fit">AI Video Prompt Builder</Badge>
        <h1 className="text-3xl font-bold tracking-tight text-[var(--text)]">AI 视频分镜 Prompt 生成器</h1>
        <p className="max-w-3xl text-sm leading-6 text-[var(--text-soft)]">用结构化 JSON 管理分镜关键词，批量生成视频时不容易忘记专业术语。</p>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-hidden rounded-2xl border border-[var(--border)]">
            <table className="w-full border-collapse text-sm">
              <thead className="bg-[var(--bg-soft)]">
                <tr>
                  <th className="w-[260px] border-b border-[var(--border)] px-4 py-3 text-left font-semibold text-[var(--text-soft)]">Key</th>
                  <th className="border-b border-[var(--border)] px-4 py-3 text-left font-semibold text-[var(--text-soft)]">Value</th>
                </tr>
              </thead>
              <tbody>
                {promptConfig.map((item) => (
                  <tr key={item.key} className="border-b border-[var(--border)] last:border-b-0">
                    <td className="px-4 py-4 align-middle">
                      <div className="flex flex-col gap-1">
                        <span className="font-semibold text-[var(--text)]">{item.label}</span>
                        <span className="text-xs text-[var(--text-faint)]">{item.key}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex flex-col gap-3">
                        <select value={customMode[item.key] ? CUSTOM_VALUE : values[item.key].en} onChange={(event) => updateValue(item.key, event.target.value)} className="h-10 w-full rounded-xl border border-[var(--border)] bg-[var(--card)] px-3 text-sm text-[var(--text)] outline-none transition focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary-soft)]">
                          {item.options.map((option) => (
                            <option key={option.en} value={option.en}>
                              {option.zh} ｜ {option.en}
                            </option>
                          ))}
                          <option value={CUSTOM_VALUE}>其他 / 自定义输入 ｜ Custom input</option>
                        </select>

                        {customMode[item.key] ? (
                          <div className="grid gap-3 md:grid-cols-2">
                            <input value={values[item.key].zh} onChange={(event) => updateCustomValue(item.key, "zh", event.target.value)} placeholder="输入中文，例如：梦幻校园镜头" className="h-10 w-full rounded-xl border border-[var(--border)] bg-[var(--card)] px-3 text-sm text-[var(--text)] outline-none transition placeholder:text-[var(--text-faint)] focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary-soft)]" />
                            <input value={values[item.key].en} onChange={(event) => updateCustomValue(item.key, "en", event.target.value)} placeholder="Enter English, e.g. dreamy campus shot" className="h-10 w-full rounded-xl border border-[var(--border)] bg-[var(--card)] px-3 text-sm text-[var(--text)] outline-none transition placeholder:text-[var(--text-faint)] focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary-soft)]" />
                          </div>
                        ) : null}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardContent className="flex flex-col gap-4 p-5">
            <div className="flex items-center justify-between gap-3">
              <CardTitle>生成的中文 Prompt</CardTitle>
              <Button onClick={copyZhPrompt}>复制中文 Prompt</Button>
            </div>
            <Textarea value={zhPromptOutput} readOnly className="min-h-[160px] resize-none text-sm leading-6" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex flex-col gap-4 p-5">
            <div className="flex items-center justify-between gap-3">
              <CardTitle>Generated English Prompt</CardTitle>
              <Button onClick={copyEnPrompt}>复制英文 Prompt</Button>
            </div>
            <Textarea value={enPromptOutput} readOnly className="min-h-[160px] resize-none text-sm leading-6" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex flex-col gap-4 p-5">
            <div className="flex items-center justify-between gap-3">
              <CardTitle>中文 JSON 数据</CardTitle>
              <Button onClick={copyZhJson}>复制中文 JSON</Button>
            </div>
            <Textarea value={zhJsonOutput} readOnly className="min-h-[160px] resize-none font-mono text-sm leading-6" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex flex-col gap-4 p-5">
            <div className="flex items-center justify-between gap-3">
              <CardTitle>English JSON Data</CardTitle>
              <Button onClick={copyEnJson}>复制英文 JSON</Button>
            </div>
            <Textarea value={enJsonOutput} readOnly className="min-h-[160px] resize-none font-mono text-sm leading-6" />
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-wrap gap-3">
        <Button onClick={resetValues} variant="secondary">重置默认值</Button>
      </div>
    </div>
  );
}