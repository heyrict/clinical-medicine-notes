# -*- coding: utf-8 -*-
# # 卫生学实验报告 —— 膳食调查
# ### Author: 五临 3 班  谢祯晖
#
# <font color="#888">Feel free to try with your own data</font>

# 调查对象：本人
#
# 调查方式：24 小时膳食回顾法

# +
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import warnings
from functools import partial

warnings.filterwarnings('ignore')

# +
nutr = pd.read_csv('./food_components2.csv')
nutr.index.name = 'ID'
nutr.fillna(0, inplace=True)

nutr.head()
# -

# ## Print all available foods (for quick reference)
# <big>Press Ctrl-F (or Command-F) to search the context</big>

with pd.option_context('display.max_rows', None, 'display.max_columns', None):
    print(nutr.iloc[:, :3])

# # Input

# +
# 所有数据按 { 
#    料理名称 : {
#        ID : 数量(g), [ID : 数量(g), [...]]
#    } 输入
# 注意：`#`号后面的为注释

# 性别: 男=1 女=0
gender = 1

# 早餐
bf = {
    '馒头': {
        4: 100,  # 馒头 2 个，100 g
    },
    '白煮蛋': {
        101: 50,  # 鸡蛋 1 个，50 g
    },
}

# 午餐
lc = {
    '米饭': {
        0: 200,  # 米饭 4 两，200 g
    },
    '土豆烧肉': {
        31: 30,  # 土豆 30 g
        107: 50,  # 猪肉 50 g
        100: 1,  # 盐 1 g
    },
    '炒土豆丝': {
        31: 50,  # 土豆丝 50 g
        60: 5,  # 菜椒丝 5 g
        37: 5,  # 胡萝卜丝 5 g
        100: 1,  # 盐 1 g
    },
}

# 晚餐
dn = {
    '米饭': {
        0: 200,  # 米饭 4 两，200 g
    },
    '萝卜烧肉': {
        33: 50,  # 白萝卜 50 g
        107: 50,  # 猪肉 50 g
        100: 1,  # 盐 1 g
    },
    '三鲜豆腐': {
        20: 75,  # 白豆腐 75 g
        46: 5,  # 鸡毛菜 5 g
        58: 5,  # 番茄 5 g
        100: 1,  # 盐 1 g
    },
}


# -

# # Output

# ## 表 1 调查摄取主副食品的名称及数量

# +
def destruct(d):
    df = pd.DataFrame(columns=['食谱', 'ID', '质量'])
    for recipe in d.items():
        for component in recipe[1].items():
            df = df.append({
                '食谱': recipe[0],
                'ID': component[0],
                '质量 (g)': component[1],
            }, ignore_index=True)

    return df

bfdf = destruct(bf)
lcdf = destruct(lc)
dndf = destruct(dn)
bfdf['餐别'] = '早餐'
lcdf['餐别'] = '午餐'
dndf['餐别'] = '晚餐'

df = pd.concat([bfdf, lcdf, dndf], ignore_index=True)
df.ID = df.ID.astype(int)
df = df.merge(nutr, left_on='ID', right_index=True, how='left')
df.loc[:, nutr.columns[3:]] = df[nutr.columns[3:]].apply(lambda r: r * df['质量 (g)'] / 100 * df['食部 (%)'] / 100)
df[['餐别', '食谱', '名称', '质量 (g)'] + list(nutr.columns[3:])].set_index(['餐别', '食谱', '名称'])\
        .applymap(partial(np.round, decimals=3))
# -

# ## 表 2 摄入量占参考摄入量标准
# 参考：https://wenku.baidu.com/view/dd44f27dec630b1c59eef8c75fbfc77da3699751.html

# +
intake_crit = pd.Series({
    '蛋白质 (g)': 75,
    '热量 (kcal)': 2250,
    '钙 (g)': 800,
    '磷 (g)': 700,
    '铁 (g)': 15 if gender else 20,
    '胡萝卜素 (g)': 750,
    '硫胺素 (g)': 1.35,
    '尼克酸 (g)': 13.5,
    '抗坏血酸 (g)': 100,
})
intake = df[intake_crit.index].sum(0)

pd.DataFrame([intake, intake_crit, intake / intake_crit * 100], index=['摄入量', '参考摄入量', '摄入量占参考摄入量 %'])\
        .applymap(partial(np.round, decimals=3))
# -

# ## 表 3 三餐热量分配

cbd = df.groupby('餐别')['热量 (kcal)'].sum()[['早餐', '午餐', '晚餐']]
cbd_adv = pd.Series({
    '早餐': 20,
    '午餐': 40,
    '晚餐': 40,
})
cbd_adv2 = pd.Series({
    '早餐': 30,
    '午餐': 40,
    '晚餐': 30,
})
pd.DataFrame([cbd, cbd / cbd.sum() * 100, cbd_adv, cbd_adv2],
             index=['每餐摄入热量 (kcal)', '占全天 %', '建议 (2/4/4)', '建议 (3/4/3)'])\
        .applymap(partial(np.round, decimals=3))

# ## 表 4 热量来源

cbc = df[['蛋白质 (g)', '脂肪 (g)', '碳水化合物 (g)']].sum()
cbc_h = cbc * [4, 9, 4]
cbc_advh = pd.Series({
    '蛋白质 (g)': '10 - 14',
    '脂肪 (g)': '20 - 30',
    '碳水化合物 (g)': '55 - 65',
})
pd.DataFrame([cbc, cbc_h, cbc_h / cbc_h.sum() * 100, cbc_advh],
            index=['摄取量 (g)', '供热量 (kcal)', '占全日热量 (%)', '建议 (%)'])

# ## 表 5 蛋白质来源

# +
p_ani = df['类别'].map(lambda x: x in ['肉及禽类', '蛋类', '乳及代乳品', '水产品'])
p_bean = df['类别'].map(lambda x: x in ['豆及豆制品', '鲜豆类'])
p_grn = df['类别'].map(lambda x: x in ['粮食类'])
p_otr = np.invert(np.any([p_ani, p_bean, p_grn], axis=0))
pbg = pd.Series({
    '动物蛋白': df['蛋白质 (g)'][p_ani].sum(),
    '豆类蛋白': df['蛋白质 (g)'][p_bean].sum(),
    '谷类蛋白': df['蛋白质 (g)'][p_grn].sum(),
    '其他蛋白': df['蛋白质 (g)'][p_otr].sum(),
})

print("动物蛋白 + 豆类蛋白 =", (pbg['动物蛋白'] + pbg['豆类蛋白']) / pbg.sum() * 100, '%')

pd.DataFrame([pbg, pbg / pbg.sum() * 100], index=['质量 (g)', '比值 (%)'])\
        .applymap(partial(np.round, decimals=3))
# -

# $\text{动物蛋白} + \text{豆类蛋白} \sim \text{总蛋白质来源的} \frac{1}{3}$

# ## 表 6 钙磷比例

print("钙总量 =", df['钙 (g)'].sum())
print("磷总量 =", df['磷 (g)'].sum())
print("钙磷比例 = 1 :", df['磷 (g)'].sum() / df['钙 (g)'].sum())
print("\n建议比例 = 1 : 1.5 - 2.0")

# ## 表 7 铁的来源

# +
febg = pd.Series({
    '动物性铁': df['铁 (g)'][p_ani].sum(),
    '其他铁': df['铁 (g)'][np.invert(p_ani)].sum(),
})

pd.DataFrame([febg, febg / febg.sum() * 100], index=["质量 (g)", "比值 (%)"])\
        .applymap(partial(np.round, decimals=3))
# -

# $\text{动物性铁占总比值} < \frac{1}{3}$

# ## 表 8 食物构成

# +
comp_grn = df['类别'].map(lambda x: x in ['粮食类'])
comp_veg = df['类别'].map(lambda x: x in ['根茎类', '蔬菜类', '瓜果类', '咸菜类', '鲜果及干果类', '菌藻类'])
comp_meat = df['类别'].map(lambda x: x in ['肉及禽类', '水产品', '蛋类'])
comp_milk = df['类别'].map(lambda x: x in ['豆及豆制品', '鲜豆类', '乳及代乳品'])
comp_salt = df['名称'].map(lambda x: x in ['精盐'])
comp_oil = df['名称'].map(lambda x: x in ['猪油 (炼)', '植物油'])

compbg = pd.Series({
    '谷黍类': df[comp_grn]['质量 (g)'].sum(),
    '蔬菜瓜果类': df[comp_veg]['质量 (g)'].sum(),
    '鱼肉蛋类': df[comp_meat]['质量 (g)'].sum(),
    '奶豆类': df[comp_milk]['质量 (g)'].sum(),
    '盐油类': df[comp_salt]['质量 (g)'].sum() + df[comp_oil]['质量 (g)'].sum(),
})

pd.DataFrame([compbg, compbg / compbg.sum() * 100], index=['质量 (g)', '比值 (%)'])\
        .applymap(partial(np.round, decimals=3))
# -

# # 讨论

# 1. 该同学钙与维生素 C 摄入量明显低于参考摄入量 ( < 80% ), 需要补充, 蛋白质、β-胡萝卜素可以适当加以补充 ( > 80%, < 90% )。
# 1. 该同学三餐热能分配较为均衡，符合推荐的 2/4/4 比例, 三大热能比例较为均衡, 在建议值的范围之内。
# 1. 该同学摄入蛋白质中，优质蛋白质所占比重约为 $\frac{1}{3}$。
# 1. 该同学钙磷比例不平衡，钙摄入量缺乏 (41.7 % DRI), 磷摄入偏多 (184.9 % DRI), 可适当补充含钙较多的食品, 如：豆腐、虾皮、海带等。
# 1. 该同学动物性铁摄入占总比值 $ < \frac{1}{3}$, 应多补充一些含动物性铁较多的食品, 如：猪肝、鸡肝等。
# 1. 该同学食物构成谷黍类偏多，蔬菜瓜果类偏少，需要多吃一些蔬菜水果。
#
# 由于该调查采用回顾法，存在回忆偏倚，难以正确统计盐、油的摄入量。如果需要准确计量各项指标，应采用称重法。
#
