import _serverProxy2 from 'cvat-core/src/auto-anno';

const serverProxy: any = _serverProxy2;

export default function getServer(): any {
    return serverProxy;
}