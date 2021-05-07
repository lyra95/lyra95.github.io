hugo -t "zdoc"
cd public
git add .
git commit -m '.'
git push
cd ..
git add .
git commit -m '.'
git push
exit