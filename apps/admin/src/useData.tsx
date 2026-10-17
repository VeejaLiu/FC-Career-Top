import { useEffect, useState } from "react";
import { Banner, Button, Spin } from "@douyinfe/semi-ui";
import { api, errorMessage } from "./api";
export function useData<T>(path: string) {
  const [data, setData] = useState<T>();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [version, setVersion] = useState(0);
  useEffect(() => {
    let alive = true;
    setLoading(true);
    setError("");
    api<T>(path)
      .then((value) => {
        if (alive) setData(value);
      })
      .catch((error) => {
        if (alive) setError(errorMessage(error));
      })
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, [path, version]);
  return { data, error, loading, reload: () => setVersion((v) => v + 1) };
}
export function DataState({
  loading,
  error,
  reload,
}: {
  loading: boolean;
  error: string;
  reload: () => void;
}) {
  if (error)
    return (
      <Banner
        type="danger"
        description={error}
        fullMode={false}
        closeIcon={null}
      >
        <Button onClick={reload}>重试</Button>
      </Banner>
    );
  if (loading)
    return (
      <div className="loading">
        <Spin size="large" tip="正在加载数据…" />
      </div>
    );
  return null;
}
