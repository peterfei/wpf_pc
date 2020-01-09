@echo off
@set unity="D:\Program Files\unity2017.2.0.f3\Editor\Unity.exe"
@set unityProjectPath="D:\UnityWorkSpace\UnityPC\VesalUnityCombine_user"
@set unityBranch=dev
@set reactProjectPath="D:\Vesal\Vesal_PC_user\wpf_new"
@set reactBranch=vesal_user

@set mainAssetsPath=".\Vesal_PC\bin\x86\ReleaseBundle"
@set WindowsExePath=".\Vesal_PC\bin\x86\ReleaseBundle\win"
@set exportWindowsExePath="D:\vesal"
@set reactAssetsPath=".\Vesal_PC\bin\x86\ReleaseBundle\ReactAssets"

REM rem 切换分支 %unityBranch% branch
REM git -C %unityProjectPath% checkout %unityBranch%
REM git -C %unityProjectPath% pull origin %unityBranch%
REM rem 切换分支 %reactBranch% branch
REM git -C %reactProjectPath% checkout %reactBranch%
REM git -C %reactProjectPath% pull origin %reactBranch%

rem 删除版本文件 delete ReleaseBundle
rd /Q /S %mainAssetsPath%

REM 1. 创建window原生应用程序 re-build-x86-releasebundle bin file
call "D:\Program Files (x86)\Microsoft Visual Studio\2017\Community\Common7\Tools\VsDevCmd.bat"
msbuild /p:Configuration=ReleaseBundle;Platform=x86 /target:Clean;Rebuild

REM 2. 导出react bundle文件 export react-native bundle! copy ReactAssets to releasebundle 
cd ..\
call build_react_asset.bat
echo react assets over
cd .\wpf
echo D | xcopy .\Vesal_PC\ReactAssets  %reactAssetsPath% /s /y

rem 3. 添加下载库文件 add extral file(wget.exe etc)
echo D | xcopy .\build_extral\wget .\Vesal_PC\bin\x86\ReleaseBundle\wget /s /y
mkdir .\Vesal_PC\bin\x86\ReleaseBundle\download

rem 4. 导出unity到指定目录 exporting windows application exe file...（see code in Commandbuild.cs）
rd /Q /S %exportWindowsExePath%
call %unity% -quit -batchmode -nographics -logFile ./UnityEditor.log -projectPath  %unityProjectPath% -executeMethod Build.StandaloneWindows32
echo D | xcopy %exportWindowsExePath%  %WindowsExePath% /s /y
rem replace sqlite3-win32 file to unity plugin floder
echo D | xcopy .\build_extral\sqlite3.dll .\Vesal_PC\bin\x86\ReleaseBundle\win\vesal_Data\Plugins\ /s /y

rem 构建完成 build complete
cd %mainAssetsPath%
start ..\