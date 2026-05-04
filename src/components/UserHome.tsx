import { Card, CardBody, CardFooter, CardHeader } from '@heroui/react';
import { useStore } from '@/utils/store';

export function UserHome() {
  const user = useStore(state => state.user);

  return (
    <Card className="mr-8">
      <CardHeader className="flex flex-col">
        <h3 className="font-bold text-xl">个人简介</h3>
        <p className="font-light text-sm">关于我的更多信息。</p>
      </CardHeader>
      <CardBody className="space-y-4">
        <p>{user.introduction !== '' ? user.introduction : '暂无自我介绍'}</p>
      </CardBody>
      <CardFooter>
        <div className="w-full flex justify-start gap-28">
          <div className="flex items-center space-x-2">
            <span className="font-semibold">现居地:</span>
            <span>{user.residence !== '' ? user.residence : '暂无'}</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="font-semibold">兴趣:</span>
            <span>{user.interest !== '' ? user.interest : '暂未填写兴趣爱好'}</span>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
