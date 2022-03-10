from os.path import splitext
from os import listdir
import os
import numpy as np
import torch
from torch.utils.data import Dataset
import pandas as pd


features = ['BLUE','GREEN','RED','NIR','SWIR1','SWIR2']
class BasicDataset(Dataset):
    def __init__(self, file_path,add_data=None):
        m_data = pd.read_csv(file_path)
        data = m_data[features]
        m,n = data.shape
        self.lines = []
        for i in range(m):
            self.lines.append(data.loc[i].values)
        if add_data!=None:
            self.labels = np.concatenate((m_data['CLASS'].values,np.array(add_data['label'])),axis=0)
            self.lines += add_data['feature']
        else:
            self.labels = m_data['CLASS'].values

    def __len__(self):
        return len(self.lines)

    def __getitem__(self, i):
        # 获取文件名
        train_data = self.lines[i]

        return {'image':torch.from_numpy(train_data).type(torch.FloatTensor),'label':torch.tensor(self.labels[i]).type(torch.LongTensor)}



# 将图片转化为数据集
import tifffile
import numpy as np
class imageToDataset(Dataset):
    def __init__(self, tif_files,start_cla=3100):
        tifbands = list(range(2,8))
        import logging
        logging.basicConfig(level = logging.INFO,format = '%(asctime)s - %(name)s - %(levelname)s - %(message)s')
        logger = logging.getLogger(__name__)
        logger.info(tif_files)
        pre_filename = tif_files[0][:-5]
        test_band = tifffile.imread(tif_files[0])
        image = np.zeros((test_band.shape[0],test_band.shape[1],6),dtype=test_band.dtype)
        print(tifbands)
        for band in tifbands:
            band_data = tifffile.imread(pre_filename+str(band)+".tif")
            print(pre_filename+str(band)+".tif")
            image[:,:,band-2] = band_data
        image = image[start_cla:start_cla+100,start_cla:start_cla+100,:]/10000
        m,n,_ = image.shape
        self.lines = []
        for i in range(m):
            for j in range(n):
                self.lines.append(image[i,j,:])

    def __len__(self):
        return len(self.lines)

    def __getitem__(self, i):
        train_data = self.lines[i]
        return {'image':torch.from_numpy(train_data).type(torch.FloatTensor)}
