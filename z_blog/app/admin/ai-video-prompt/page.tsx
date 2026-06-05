"use client";

import { useMemo, useState } from "react";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

type PromptKey = "shotSize" | "character" | "action" | "cameraMovement" | "facialExpression" | "lighting" | "style";

type PromptConfigItem = {
  label: string;
  key: PromptKey;
  options: string[];
};

const promptConfig: PromptConfigItem[] = [
  {
    label: "景别 Shot Size",
    key: "shotSize",
    options: ["Extreme Close Up", "Close Up", "Medium Close Up", "Medium Shot", "Medium Long Shot", "Wide Shot", "Extreme Wide Shot"],
  },
  {
    label: "人物 Character",
    key: "character",
    options: ["a young Asian female student", "a female English teacher", "a teenage boy student", "a group of students", "a cute animated girl", "a realistic office worker"],
  },
  {
    label: "动作 Action",
    key: "action",
    options: ["listens carefully to an English sentence", "writes quickly in a notebook", "repeats the sentence softly", "memorizes the sentence with focus", "looks at the screen with excitement", "celebrates after answering correctly"],
  },
  {
    label: "摄影机运动 Camera Movement",
    key: "cameraMovement",
    options: ["slow dolly in", "dolly out", "pan left", "pan right", "tilt up", "tilt down", "tracking shot", "orbit shot", "static camera"],
  },
  {
    label: "表情 Facial Expression",
    key: "facialExpression",
    options: ["focused expression", "confident smile", "excited expression", "surprised face", "relieved smile", "proud expression", "nervous but determined"],
  },
  {
    label: "灯光 Lighting",
    key: "lighting",
    options: ["warm cinematic lighting", "soft natural light", "golden hour lighting", "bright classroom lighting", "dramatic backlight", "soft studio lighting", "volumetric light"],
  },
  {
    label: "风格 Style",
    key: "style",
    options: ["cinematic", "photorealistic", "3D animated style", "anime style", "Pixar-like style", "educational video style", "soft pastel animation"],
  },
];

const initialValues: Record<PromptKey, string> = {
  shotSize: "Medium Close Up",
  character: "a young Asian female student",
  action: "listens carefully to an English sentence",
  cameraMovement: "slow dolly in",
  facialExpression: "confident smile",
  lighting: "warm cinematic lighting",
  style: "cinematic",
};

export default function AIVideoPromptPage() {
  const [values, setValues] = useState<Record<PromptKey, string>>(initialValues);

  const jsonOutput = useMemo(() => {
    return JSON.stringify(values, null, 2);
  }, [values]);

  const promptOutput = useMemo(() => {
    return `${values.shotSize}, ${values.character}, ${values.action}, ${values.cameraMovement}, ${values.facialExpression}, ${values.lighting}, ${values.style}.`;
  }, [values]);

  const updateValue = (key: PromptKey, value: string) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  };

  const resetValues = () => {
    setValues(initialValues);
  };

  const copyPrompt = async () => {
    await navigator.clipboard.writeText(promptOutput);
  };

  const copyJson = async () => {
    await navigator.clipboard.writeText(jsonOutput);
  };

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 p-6">
      <div className="flex flex-col gap-3">
        <Badge className="w-fit">AI Video Prompt Builder</Badge>
        <h1 className="text-3xl font-bold tracking-tight text-slate-950">AI 视频分镜 Prompt 生成器</h1>
        <p className="max-w-3xl text-sm leading-6 text-slate-600">用结构化 JSON 管理分镜关键词，批量生成视频时不容易忘记专业术语。</p>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-hidden rounded-2xl border border-slate-200">
            <table className="w-full border-collapse text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th className="w-[260px] border-b border-slate-200 px-4 py-3 text-left font-semibold text-slate-700">Key</th>
                  <th className="border-b border-slate-200 px-4 py-3 text-left font-semibold text-slate-700">Value</th>
                </tr>
              </thead>
              <tbody>
                {promptConfig.map((item) => (
                  <tr key={item.key} className="border-b border-slate-100 last:border-b-0">
                    <td className="px-4 py-4 align-middle">
                      <div className="flex flex-col gap-1">
                        <span className="font-semibold text-slate-900">{item.label}</span>
                        <span className="text-xs text-slate-500">{item.key}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <select value={values[item.key]} onChange={(event) => updateValue(item.key, event.target.value)} className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-800 outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-100">
                        {item.options.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
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
              <CardTitle>生成的 Prompt</CardTitle>
              <Button onClick={copyPrompt}>复制 Prompt</Button>
            </div>
            <Textarea value={promptOutput} readOnly className="min-h-[160px] resize-none text-sm leading-6" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex flex-col gap-4 p-5">
            <div className="flex items-center justify-between gap-3">
              <CardTitle>JSON 数据</CardTitle>
              <Button onClick={copyJson}>复制 JSON</Button>
            </div>
            <Textarea value={jsonOutput} readOnly className="min-h-[160px] resize-none font-mono text-sm leading-6" />
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-wrap gap-3">
        <Button onClick={resetValues} variant="secondary">重置默认值</Button>
      </div>
    </div>
  );
}