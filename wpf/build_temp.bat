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

echo D | xcopy %exportWindowsExePath%  %WindowsExePath% /s /y