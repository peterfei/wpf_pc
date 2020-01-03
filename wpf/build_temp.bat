@set unity="D:\Program Files\unity2017.2.0.f3\Editor\Unity.exe"
@set unityProjectPath="D:\UnityWorkSpace\UnityPC\VesalUnityCombine_user"
@set unityBranch=dev
@set reactProjectPath="D:\Vesal\Vesal_PC_user\wpf_new"
@set reactBranch=vesal_user

@set mainAssetsPath=".\Vesal_PC\bin\x86\ReleaseBundle"
@set exportWindowsExePath=".\Vesal_PC\bin\x86\ReleaseBundle\win"
@set reactAssetsPath=".\Vesal_PC\bin\x86\ReleaseBundle\ReactAssets"

REM rem 1. 创建window原生应用程序 re-build-x86-releasebundle bin file
REM call "D:\Program Files (x86)\Microsoft Visual Studio\2017\Community\Common7\Tools\VsDevCmd.bat"
REM msbuild /p:Configuration=ReleaseBundle;Platform=x86 /target:Clean;Rebuild

REM 2. 导出react bundle文件 export react-native bundle! copy ReactAssets to releasebundle 
cd ..\
REM react-native bundle --platform windows --entry-file index.js --dev false --bundle-output wpf/Vesal_PC/ReactAssets\/index.wpf.bundle  --assets-dest wpf/Vesal_PC/ReactAssets/
cd .\wpf
echo D | xcopy .\Vesal_PC\ReactAssets  %reactAssetsPath% /s /y

pause

rem 构建完成 build complete
cd %mainAssetsPath%
start ..\